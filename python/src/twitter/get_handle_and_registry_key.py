from typing import Tuple

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from constants import TWITTER_ROOT_PARENT_REGISTRY_KEY, TWITTER_VERIFICATION_AUTHORITY
from twitter.ReverseTwitterRegistryState import ReverseTwitterRegistryState
from utils import get_hashed_name, get_name_account_key


async def get_twitter_handle_and_registry_key(
        connection: AsyncClient,
        verified_pubkey: Pubkey,
) -> Tuple[str, Pubkey]:
    hashed_verified_pubkey = get_hashed_name(str(verified_pubkey))
    reverse_registry_key = get_name_account_key(
        hashed_verified_pubkey,
        TWITTER_VERIFICATION_AUTHORITY,
        TWITTER_ROOT_PARENT_REGISTRY_KEY
    )

    reverse_registry = await ReverseTwitterRegistryState.retrieve(
        connection,
        reverse_registry_key,
    )

    return (
        reverse_registry.handle,
        Pubkey(reverse_registry.registry),
    )