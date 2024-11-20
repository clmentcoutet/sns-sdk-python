from typing import Optional

from solders.pubkey import Pubkey

from constants import REVERSE_LOOKUP_CLASS
from get_hashed_name_sync import get_hashed_name_sync
from get_name_account_key_sync import get_name_account_key


def get_reverse_key_from_domain_key(
    domain_key: Pubkey, parent: Optional[Pubkey] = None
) -> Pubkey:
    hashed_reverse_lookup = get_hashed_name_sync(str(domain_key))
    return get_name_account_key(
        hashed_reverse_lookup, name_class=REVERSE_LOOKUP_CLASS, name_parent=parent
    )
