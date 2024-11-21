from typing import Optional, List

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts, DataSliceOpts
from solders.rpc.responses import GetProgramAccountsResp

from constants import ROOT_DOMAIN_ACCOUNT, NAME_PROGRAM_ID


async def get_all_registered_domains(
    connection: AsyncClient,
    *,
    filters: Optional[List[MemcmpOpts]] = None,
    data_slice: Optional[DataSliceOpts] = None,
) -> GetProgramAccountsResp:
    filters = (
        [MemcmpOpts(offset=0, bytes=str(ROOT_DOMAIN_ACCOUNT))]
        if filters is None
        else filters
    )
    data_slice = (
        DataSliceOpts(offset=32, length=32) if data_slice is None else data_slice
    )
    accounts = await connection.get_program_accounts(
        NAME_PROGRAM_ID, filters=filters, data_slice=data_slice
    )
    return accounts
