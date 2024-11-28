from typing import Tuple

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import TWITTER_ROOT_PARENT_REGISTRY_KEY, TWITTER_VERIFICATION_AUTHORITY, NAME_PROGRAM_ID
from exception import AccountDoesNotExistException
from twitter.ReverseTwitterRegistryState import ReverseTwitterRegistryState


async def get_twitter_handle_and_registry_key_via_filters(
        connection: AsyncClient,
        verified_pubkey: Pubkey,
) -> Tuple[str, Pubkey]:
    filters = [
        MemcmpOpts(
            offset=0,
            bytes=str(TWITTER_ROOT_PARENT_REGISTRY_KEY)
        ),
        MemcmpOpts(
            offset=32,
            bytes=str(verified_pubkey)
        ),
        MemcmpOpts(
            offset=64,
            bytes=str(TWITTER_VERIFICATION_AUTHORITY)
        )
    ]
    filtered_accounts = await connection.get_program_accounts(
        NAME_PROGRAM_ID,
        filters=filters,
        encoding="base64"
    )
    if not filtered_accounts.value:
        raise ValueError("No Twitter handle found for this pubkey")

    for f_account in filtered_accounts.value:
        if len(f_account.account.data) > NameRegistryState.HEADER_LEN + 32:
            data = f_account.account.data[NameRegistryState.HEADER_LEN:]
            state = ReverseTwitterRegistryState.deserialize(
                data
            )
            return state.handle, Pubkey(state.registry)

    raise AccountDoesNotExistException("The twitter account does not exist")