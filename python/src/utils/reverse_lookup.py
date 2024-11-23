from typing import Optional

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from exception import NoAccountDataException
from utils.deserialize_reverse import deserialize_reverse
from utils.get_reverse_key_from_domain_key import get_reverse_key_from_domain_key


async def reverse_lookup(
    connection: AsyncClient, name_account: Pubkey, parent: Optional[Pubkey] = None
) -> str:
    """
    Reverse lookup the name of an account given the address of the account.
    :param connection:
    :param name_account:
    :param parent:
    :return: human-readable name of the domain name
    """
    reverse_key = get_reverse_key_from_domain_key(name_account, parent)

    registry = await NameRegistryState.retrieve(connection, reverse_key)
    if registry is None or registry.data is None:
        raise NoAccountDataException("The registry data is empty")

    return deserialize_reverse(registry.data, bool(parent is not None))  # type: ignore[no-any-return]
