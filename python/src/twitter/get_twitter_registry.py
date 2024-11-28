from solana.rpc.async_api import AsyncClient

from NameRegistryState import NameRegistryState
from twitter.get_twitter_registry_key import get_twitter_registry_key


async def get_twitter_registry(
        connection: AsyncClient,
        twitter_handle: str,
) -> NameRegistryState:
    registry_key = get_twitter_registry_key(twitter_handle)
    return await NameRegistryState.retrieve(
        connection,
        registry_key,
    )