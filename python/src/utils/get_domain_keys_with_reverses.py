from typing import List, TypedDict

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from utils.get_all_domains import get_all_domains
from utils.reverse_lookup_batch import reverse_lookup_batch


class DomainKeysReversesResp(TypedDict):
    pubkey: Pubkey
    domain: str | None


async def get_domain_keys_with_reverses(
    connection: AsyncClient,
    wallet: Pubkey,
    batch_size: int = 100,
) -> List[DomainKeysReversesResp]:
    """
    Get all domain keys with their reverse lookup names
    :param connection:
    :param wallet:
    :return:
    """
    encoded_name_array = await get_all_domains(connection, wallet)
    names = await reverse_lookup_batch(connection, encoded_name_array, batch_size)

    return [
        {"pubkey": pubkey, "domain": names[index]}
        for index, pubkey in enumerate(encoded_name_array)
    ]
