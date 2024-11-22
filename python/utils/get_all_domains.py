from typing import List

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts, DataSliceOpts
from solders.pubkey import Pubkey

from constants import ROOT_DOMAIN_ACCOUNT, NAME_PROGRAM_ID


async def get_all_domains(
    connection: AsyncClient,
    wallet: Pubkey,
) -> List[Pubkey]:
    filters = [
        MemcmpOpts(
            offset=32,
            bytes=str(wallet),
        ),
        MemcmpOpts(
            offset=0,
            bytes=str(ROOT_DOMAIN_ACCOUNT),
        ),
    ]
    data_slice = DataSliceOpts(offset=0, length=0)

    account = await connection.get_program_accounts(
        pubkey=NAME_PROGRAM_ID,
        filters=filters,
        data_slice=data_slice,
    )
    return [elem.pubkey for elem in account.value]
