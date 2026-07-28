from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from backend.database import get_database_connection, initialize_database

FRONTEND_DIRECTORY = Path(__file__).resolve().parent.parent / "frontend"

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