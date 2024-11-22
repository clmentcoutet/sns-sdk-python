from typing import List

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from utils.deserialize_reverse import deserialize_reverse
from utils.get_reverse_key_from_domain_key import get_reverse_key_from_domain_key


async def reverse_lookup_batch(
    connection: AsyncClient, name_accounts: List[Pubkey]
) -> List[str | None]:
    reverse_lookup_accounts: List[Pubkey] = []
    for name_account in name_accounts:
        reverse_lookup_accounts.append(get_reverse_key_from_domain_key(name_account))

    names = await NameRegistryState.retrieve_batch(connection, reverse_lookup_accounts)
    return [
        deserialize_reverse(name.data)
        if (name is not None and name.data is not None)
        else None
        for name in names
    ]
