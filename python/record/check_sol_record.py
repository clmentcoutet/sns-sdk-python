from solders.pubkey import Pubkey
from nacl.signing import VerifyKey


def check_sol_record(
        record: bytes,
        signed_record: bytes,
        pubkey: Pubkey,
) -> bool:
    """
    Check if a SOL record is valid, on ed25519 curve.
    :param record: The record to check.
    :param signed_record: The signed record to check.
    :param pubkey: The pubkey to check against.
    :return: True if the record is valid, False otherwise.
    """
    try:
        verify_key = VerifyKey(bytes(pubkey))
        verify_key.verify(record, signed_record)
        return True  # Signature is valid
    except Exception:
        return False  # Signature is invalid