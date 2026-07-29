from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timezone
from uuid import uuid4

from backend.database import get_database_connection, initialize_database

FRONTEND_DIRECTORY = Path(__file__).resolve().parent.parent / "frontend"

class SaleItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class SaleRequest(BaseModel):
    payment_method: Literal["cash", "card"]
    items: list[SaleItemRequest]

initialize_database()

app = FastAPI(title="Ice Cream Shop POS")

app.mount(
    "/static",
    StaticFiles(directory=FRONTEND_DIRECTORY),
    name="static"
)

@app.get("/", response_class=FileResponse)
def get_pos_page():
    return FRONTEND_DIRECTORY / "index.html"

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Ice Cream Shop POS backend is running"
    }


@app.get("/api/products")
def get_products():
    connection = get_database_connection()

    products = connection.execute(
        """
        SELECT id, name, price_cents
        FROM products
        WHERE active = 1
        ORDER BY name
        """
    ).fetchall()

    connection.close()

    return [
        {
            "id": product["id"],
            "name": product["name"],
            "price_cents": product["price_cents"]
        }
        for product in products
    ]

@app.get("/api/sales")
def get_sales():
    connection = get_database_connection()

    sales = connection.execute(
        """
        SELECT
            id,
            receipt_number,
            created_at,
            payment_method,
            total_cents,
            status
        FROM sales
        ORDER BY created_at DESC
        """
    ).fetchall()

    connection.close()

    return [
        {
            "id": sale["id"],
            "receipt_number": sale["receipt_number"],
            "created_at": sale["created_at"],
            "payment_method": sale["payment_method"],
            "total_cents": sale["total_cents"],
            "status": sale["status"]
        }
        for sale in sales
    ]

@app.get("/api/sales/{sale_id}")
def get_sale(sale_id: int):
    connection = get_database_connection()

    try:
        sale = connection.execute(
            """
            SELECT
                id,
                receipt_number,
                created_at,
                payment_method,
                total_cents,
                status
            FROM sales
            WHERE id = ?
            """,
            (sale_id,)
        ).fetchone()

        if sale is None:
            raise HTTPException(
                status_code=404,
                detail="Račun nije pronađen."
            )

        items = connection.execute(
            """
            SELECT
                product_id,
                product_name,
                unit_price_cents,
                quantity,
                line_total_cents
            FROM sale_items
            WHERE sale_id = ?
            ORDER BY id
            """,
            (sale_id,)
        ).fetchall()

        return {
            "id": sale["id"],
            "receipt_number": sale["receipt_number"],
            "created_at": sale["created_at"],
            "payment_method": sale["payment_method"],
            "total_cents": sale["total_cents"],
            "status": sale["status"],
            "items": [
                {
                    "product_id": item["product_id"],
                    "product_name": item["product_name"],
                    "unit_price_cents": item["unit_price_cents"],
                    "quantity": item["quantity"],
                    "line_total_cents": item["line_total_cents"]
                }
                for item in items
            ]
        }

    finally:
        connection.close()

@app.post("/api/sales", status_code=201)
def create_sale(sale: SaleRequest):
    if not sale.items:
        raise HTTPException(
            status_code=400,
            detail="Račun mora sadržavati barem jedan proizvod."
        )

    connection = get_database_connection()

    try:
        prepared_items = []
        total_cents = 0

        for requested_item in sale.items:
            product = connection.execute(
                """
                SELECT id, name, price_cents
                FROM products
                WHERE id = ? AND active = 1
                """,
                (requested_item.product_id,)
            ).fetchone()

            if product is None:
                raise HTTPException(
                    status_code=404,
                    detail="Proizvod nije pronađen ili nije aktivan."
                )

            line_total_cents = (
                product["price_cents"] * requested_item.quantity
            )

            total_cents += line_total_cents

            prepared_items.append({
                "product_id": product["id"],
                "product_name": product["name"],
                "unit_price_cents": product["price_cents"],
                "quantity": requested_item.quantity,
                "line_total_cents": line_total_cents
            })

        receipt_number = f"DEMO-{uuid4().hex[:8].upper()}"
        created_at = datetime.now(timezone.utc).isoformat()

        sale_cursor = connection.execute(
            """
            INSERT INTO sales (
                receipt_number,
                created_at,
                payment_method,
                total_cents,
                status
            )
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                receipt_number,
                created_at,
                sale.payment_method,
                total_cents,
                "completed"
            )
        )


        sale_id = sale_cursor.lastrowid

        for item in prepared_items:
            connection.execute(
                """
                INSERT INTO sale_items (
                    sale_id,
                    product_id,
                    product_name,
                    unit_price_cents,
                    quantity,
                    line_total_cents
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    sale_id,
                    item["product_id"],
                    item["product_name"],
                    item["unit_price_cents"],
                    item["quantity"],
                    item["line_total_cents"]
                )
            )

        connection.commit()

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

    return {
        "id": sale_id,
        "receipt_number": receipt_number,
        "created_at": created_at,
        "payment_method": sale.payment_method,
        "total_cents": total_cents,
        "status": "completed",
        "items": prepared_items
    }