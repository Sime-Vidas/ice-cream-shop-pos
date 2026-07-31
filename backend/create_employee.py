from datetime import datetime, timezone
from getpass import getpass

from backend.database import get_database_connection
from backend.security import hash_pin, verify_pin


def create_employee():
    name = input("Ime zaposlenika: ").strip()
    role = input(
        "Uloga (cashier/admin): "
    ).strip().lower()

    if not name:
        print("Ime ne smije biti prazno.")
        return

    if role not in {"cashier", "admin"}:
        print("Uloga mora biti cashier ili admin.")
        return

    pin = getpass("PIN (4-6 znamenki): ")
    repeated_pin = getpass("Ponovi PIN: ")

    if not pin.isdigit() or not 4 <= len(pin) <= 6:
        print("PIN mora sadržavati 4 do 6 znamenki.")
        return

    if pin != repeated_pin:
        print("PIN-ovi se ne podudaraju.")
        return

    pin_hash, pin_salt = hash_pin(pin)

    connection = get_database_connection()

    try:
        existing_employee = connection.execute(
            """
            SELECT id
            FROM employees
            WHERE LOWER(name) = LOWER(?)
              AND active = 1
            """,
            (name,)
        ).fetchone()

        if existing_employee is not None:
            print("Aktivni zaposlenik s tim imenom već postoji.")
            return

        employees = connection.execute(
            """
            SELECT pin_hash, pin_salt
            FROM employees
            WHERE active = 1
            """
        ).fetchall()

        duplicate_pin = any(
            verify_pin(
                pin,
                employee["pin_hash"],
                employee["pin_salt"]
            )
            for employee in employees
        )

        if duplicate_pin:
            print("Aktivni zaposlenik s tim PIN-om već postoji.")
            return

        connection.execute(
            """
            INSERT INTO employees (
                name,
                pin_hash,
                pin_salt,
                role,
                active,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                name,
                pin_hash,
                pin_salt,
                role,
                1,
                datetime.now(timezone.utc).isoformat()
            )
            
        )

        connection.commit()
        print(f"Zaposlenik {name} uspješno je kreiran.")

    finally:
        connection.close()


if __name__ == "__main__":
    create_employee()