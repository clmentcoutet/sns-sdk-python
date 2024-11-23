from typing import Optional

from solders.pubkey import Pubkey

from constants import REVERSE_LOOKUP_CLASS
from utils import get_domain_key, get_hashed_name, get_name_account_key


def get_reverse_key(
        domain: str,
        is_sub: Optional[bool] = False
) -> Pubkey:
    res = get_domain_key(domain)
    pubkey = res["pubkey"]
    parent = res["parent"]

    hashed_reverse_lookup = get_hashed_name(str(pubkey))

    return get_name_account_key(
        hashed_reverse_lookup,
        REVERSE_LOOKUP_CLASS,
        parent if is_sub else None
    )