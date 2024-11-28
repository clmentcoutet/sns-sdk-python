from typing import List

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts, DataSliceOpts
from solders.pubkey import Pubkey

from constants import REVERSE_LOOKUP_CLASS, NAME_PROGRAM_ID
from utils import deserialize_reverse
from utils.get_reverse_key_from_domain_key import get_reverse_key_from_domain_key


async def find_subdomains(
        connection: AsyncClient,
        parent: Pubkey
) -> List[str]:
    filters_revs = [
        MemcmpOpts(
            offset=0,
            bytes=str(parent),
        ),
        MemcmpOpts(
            offset=64,
            bytes=str(REVERSE_LOOKUP_CLASS),
        )
    ]
    reverses = await connection.get_program_accounts(
        NAME_PROGRAM_ID, filters=filters_revs
    )

    filters_subs = [
        MemcmpOpts(
            offset=0,
            bytes=str(parent),
        ),
    ]
    subs = await connection.get_program_accounts(
        NAME_PROGRAM_ID,
        filters=filters_subs,
        data_slice=DataSliceOpts(offset=0, length=0)
    )
    map = {
        str(e.pubkey): deserialize_reverse(e.account.data[96:], True)
        for e in reverses.value
    }

    result: List[str] = []
    for e in subs.value:
        rev_key = str(get_reverse_key_from_domain_key(e.pubkey, parent))
        rev = map.get(rev_key)
        if rev:
            result.append(rev)

    return result
