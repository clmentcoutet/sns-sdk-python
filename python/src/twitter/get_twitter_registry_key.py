from solders.pubkey import Pubkey

from constants import TWITTER_ROOT_PARENT_REGISTRY_KEY
from utils import get_hashed_name, get_name_account_key


def get_twitter_registry_key(
        twitter_handle: str,
) -> Pubkey:
    hashed_twitter_handle = get_hashed_name(twitter_handle)
    return get_name_account_key(
        hashed_twitter_handle,
        None,
        TWITTER_ROOT_PARENT_REGISTRY_KEY
    )