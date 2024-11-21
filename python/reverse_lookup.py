from typing import Optional

from borsh_construct import CStruct, U8
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from deserialize_reverse import deserialize_reverse
from exception import NoAccountDataException
from get_reverse_key_from_domain_key import get_reverse_key_from_domain_key

HEADER_LEN = 96
schema = CStruct(
    "parentName" / U8[32],
    "owner" / U8[32],
    "class" / U8[32],
)


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

    return deserialize_reverse(registry.data, bool(parent is not None))
