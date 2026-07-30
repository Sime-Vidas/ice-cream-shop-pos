from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from uuid import uuid4

from backend.database import get_database_connection, initialize_database

FRONTEND_DIRECTORY = Path(__file__).resolve().parent.parent / "frontend"

SHOP_TIMEZONE = ZoneInfo("Europe/Zagreb")

class SaleItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class SaleRequest(BaseModel):
    payment_method: Literal["cash", "card"]
    cash_received_cents: int | None = Field(
        default=None,
        ge=0
    )
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

@app.get("/api/reports/today")
def get_today_report():
    now_zagreb = datetime.now(SHOP_TIMEZONE)

    start_of_day_zagreb = now_zagreb.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    start_of_next_day_zagreb = (
        start_of_day_zagreb + timedelta(days=1)
    )

    start_utc = (
        start_of_day_zagreb
        .astimezone(timezone.utc)
        .isoformat()
    )

    end_utc = (
        start_of_next_day_zagreb
        .astimezone(timezone.utc)
        .isoformat()
    )

    connection = get_database_connection()

    try:
        report = connection.execute(
            """
            SELECT
                COUNT(
                    CASE
                        WHEN status = 'completed'
                        THEN 1
                    END
                ) AS receipt_count,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'completed'
                            THEN total_cents
                            ELSE 0
                        END
                    ),
                    0
                ) AS total_cents,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'completed'
                                AND payment_method = 'cash'
                            THEN total_cents
                            ELSE 0
                        END
                    ),
                    0
                ) AS cash_total_cents,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'completed'
                                AND payment_method = 'card'
                            THEN total_cents
                            ELSE 0
                        END
                    ),
                    0
                ) AS card_total_cents,

                COUNT(
                    CASE
                        WHEN status = 'storned'
                        THEN 1
                    END
                ) AS storned_receipt_count,

                COALESCE(
                    SUM(
                        CASE
                            WHEN status = 'storned'
                            THEN total_cents
                            ELSE 0
                        END
                    ),
                    0
                ) AS storned_total_cents
            FROM sales
            WHERE created_at >= ?
              AND created_at < ?
            """,
            (start_utc, end_utc)
        ).fetchone()

        return {
            "date": now_zagreb.date().isoformat(),
            "total_cents": report["total_cents"],
            "cash_total_cents": report["cash_total_cents"],
            "card_total_cents": report["card_total_cents"],
            "receipt_count": report["receipt_count"],
            "storned_total_cents": report["storned_total_cents"],
            "storned_receipt_count": report["storned_receipt_count"]
        }

    finally:
        connection.close()

@app.get("/api/reports/daily")
def get_daily_reports():
    connection = get_database_connection()

    try:
        sales = connection.execute(
            """
            SELECT
                created_at,
                payment_method,
                total_cents,
                status
            FROM sales
            ORDER BY created_at DESC
            """
        ).fetchall()

        reports_by_date = {}

        for sale in sales:
            created_at_utc = datetime.fromisoformat(
                sale["created_at"]
            )

            local_date = (
                created_at_utc
                .astimezone(SHOP_TIMEZONE)
                .date()
                .isoformat()
            )

            if local_date not in reports_by_date:
                reports_by_date[local_date] = {
                    "date": local_date,
                    "total_cents": 0,
                    "cash_total_cents": 0,
                    "card_total_cents": 0,
                    "receipt_count": 0,
                    "storned_total_cents": 0,
                    "storned_receipt_count": 0
                }

            report = reports_by_date[local_date]

            if sale["status"] == "completed":
                report["total_cents"] += sale["total_cents"]
                report["receipt_count"] += 1

                if sale["payment_method"] == "cash":
                    report["cash_total_cents"] += (
                        sale["total_cents"]
                    )

                if sale["payment_method"] == "card":
                    report["card_total_cents"] += (
                        sale["total_cents"]
                    )

            if sale["status"] == "storned":
                report["storned_total_cents"] += (
                    sale["total_cents"]
                )
                report["storned_receipt_count"] += 1

        return [
            reports_by_date[date]
            for date in sorted(
                reports_by_date,
                reverse=True
            )
        ]

    finally:
        connection.close()

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
                cash_received_cents,
                change_cents,
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
            "cash_received_cents": sale["cash_received_cents"],
            "change_cents": sale["change_cents"],
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

@app.post("/api/sales/{sale_id}/storno")
def storno_sale(sale_id: int):
    connection = get_database_connection()

    try:
        sale = connection.execute(
            """
            SELECT
                id,
                receipt_number,
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

        if sale["status"] == "storned":
            raise HTTPException(
                status_code=409,
                detail="Račun je već storniran."
            )

        connection.execute(
            """
            UPDATE sales
            SET status = ?
            WHERE id = ?
            """,
            ("storned", sale_id)
        )

        connection.commit()

        return {
            "id": sale["id"],
            "receipt_number": sale["receipt_number"],
            "status": "storned",
            "message": "Račun je uspješno storniran."
        }

    except Exception:
        connection.rollback()
        raise

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

        if sale.payment_method == "cash":
            if sale.cash_received_cents is None:
                raise HTTPException(
                    status_code=400,
                    detail="Potrebno je unijeti primljeni iznos."
                )

            if sale.cash_received_cents < total_cents:
                raise HTTPException(
                    status_code=400,
                    detail="Primljeni iznos nije dovoljan."
                )

            cash_received_cents = sale.cash_received_cents
            change_cents = cash_received_cents - total_cents

        else:
            if sale.cash_received_cents is not None:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Primljeni gotovinski iznos nije dopušten "
                        "za kartično plaćanje."
                    )
                )

            cash_received_cents = None
            change_cents = None

        receipt_number = f"DEMO-{uuid4().hex[:8].upper()}"
        created_at = datetime.now(timezone.utc).isoformat()

        sale_cursor = connection.execute(
            """
            INSERT INTO sales (
            receipt_number,
            created_at,
            payment_method,
            total_cents,
            cash_received_cents,
            change_cents,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
            (
                (
                receipt_number,
                created_at,
                sale.payment_method,
                total_cents,
                cash_received_cents,
                change_cents,
                "completed"
            )
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
        "cash_received_cents": cash_received_cents,
        "change_cents": change_cents,
        "status": "completed",
        "items": prepared_items
    }