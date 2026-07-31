import hashlib
import hmac
import os


PIN_HASH_ITERATIONS = 200_000


def hash_pin(pin: str):
    salt = os.urandom(16)

    pin_hash = hashlib.pbkdf2_hmac(
        "sha256",
        pin.encode("utf-8"),
        salt,
        PIN_HASH_ITERATIONS
    )

    return pin_hash.hex(), salt.hex()


def verify_pin(
    pin: str,
    stored_hash: str,
    stored_salt: str
):
    salt = bytes.fromhex(stored_salt)

    candidate_hash = hashlib.pbkdf2_hmac(
        "sha256",
        pin.encode("utf-8"),
        salt,
        PIN_HASH_ITERATIONS
    )

    return hmac.compare_digest(
        candidate_hash.hex(),
        stored_hash
    )