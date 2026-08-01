import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).resolve().parent / "pos.db"


def get_database_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection

def initialize_database():
    connection = get_database_connection()

    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price_cents INTEGER NOT NULL,
            active INTEGER NOT NULL DEFAULT 1
        );

                CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            pin_hash TEXT NOT NULL,
            pin_salt TEXT NOT NULL,
            role TEXT NOT NULL
                CHECK (role IN ('cashier', 'admin')),
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL
        );

                CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            opened_at TEXT NOT NULL,
            opened_by_employee_id INTEGER NOT NULL,
            opening_cash_cents INTEGER NOT NULL,
            closed_at TEXT,
            closed_by_employee_id INTEGER,
            expected_cash_cents INTEGER,
            actual_cash_cents INTEGER,
            cash_difference_cents INTEGER,
            status TEXT NOT NULL DEFAULT 'open'
                CHECK (status IN ('open', 'closed')),
            FOREIGN KEY (
                opened_by_employee_id
            ) REFERENCES employees(id),
            FOREIGN KEY (
                closed_by_employee_id
            ) REFERENCES employees(id)
        );

        CREATE UNIQUE INDEX IF NOT EXISTS
            one_open_shift
        ON shifts(status)
        WHERE status = 'open';

        CREATE TABLE IF NOT EXISTS sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            shift_id INTEGER,
            receipt_number TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            total_cents INTEGER NOT NULL,
            cash_received_cents INTEGER,
            change_cents INTEGER,
            status TEXT NOT NULL DEFAULT 'completed',
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (shift_id) REFERENCES shifts(id)
        );

        CREATE TABLE IF NOT EXISTS sale_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            unit_price_cents INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            line_total_cents INTEGER NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES sales(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
        """
    )

    sales_columns = {
        column["name"]
        for column in connection.execute(
            "PRAGMA table_info(sales)"
        ).fetchall()
    }

    if "employee_id" not in sales_columns:
        connection.execute(
            """
            ALTER TABLE sales
            ADD COLUMN employee_id INTEGER
            """
        )

    if "shift_id" not in sales_columns:
        connection.execute(
            """
            ALTER TABLE sales
            ADD COLUMN shift_id INTEGER
            """
        )

    if "cash_received_cents" not in sales_columns:
        connection.execute(
            """
            ALTER TABLE sales
            ADD COLUMN cash_received_cents INTEGER
            """
        )

    if "change_cents" not in sales_columns:
        connection.execute(
            """
            ALTER TABLE sales
            ADD COLUMN change_cents INTEGER
            """
        )

    existing_product = connection.execute(
        "SELECT id FROM products WHERE name = ?",
        ("Sladoled",)
    ).fetchone()

    if existing_product is None:
        connection.execute(
            """
            INSERT INTO products (name, price_cents, active)
            VALUES (?, ?, ?)
            """,
            ("Sladoled", 250, 1)
        )

    connection.commit()

    connection.close()


if __name__ == "__main__":
    initialize_database()
    print(f"Database created successfully at: {DATABASE_PATH}")