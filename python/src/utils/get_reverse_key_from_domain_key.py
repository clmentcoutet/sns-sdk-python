from typing import Optional

from solders.pubkey import Pubkey

from constants import REVERSE_LOOKUP_CLASS
from utils.get_hashed_name import get_hashed_name
from utils.get_name_account_key import get_name_account_key


def get_reverse_key_from_domain_key(
    domain_key: Pubkey, parent: Optional[Pubkey] = None
) -> Pubkey:
    """
    Get the reverse lookup key from the domain key.
    :param domain_key:
    :param parent:
    :return:
    """
    hashed_reverse_lookup = get_hashed_name(str(domain_key))
    return get_name_account_key(  # type: ignore[no-any-return]
        hashed_reverse_lookup, name_class=REVERSE_LOOKUP_CLASS, name_parent=parent
    )
