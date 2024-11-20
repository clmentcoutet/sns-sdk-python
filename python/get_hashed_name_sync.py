import hashlib

from constants import HASH_PREFIX


def get_hashed_name_sync(domain_key: str) -> bytes:
    input = HASH_PREFIX + domain_key
    # Convert to bytes and hash
    input_bytes = input.encode("utf-8")
    hashed = hashlib.sha256(input_bytes).digest()
    return hashed
