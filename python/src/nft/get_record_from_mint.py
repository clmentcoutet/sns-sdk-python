from typing import List

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts
from solders.pubkey import Pubkey
from solders.rpc.responses import GetProgramAccountsResp

from nft.constants import NAME_TOKENIZER_ID
from nft.state import NftRecord


async def get_record_from_mint(
        connection: AsyncClient,
        mint: Pubkey,
) -> GetProgramAccountsResp:
    filters: List[MemcmpOpts | int] = [
        NftRecord.LEN,
        MemcmpOpts(
            offset=0,
            bytes="3",
        ),
        MemcmpOpts(
            offset=1+1+32+32,
            bytes=str(mint),
        )
    ]

    return await connection.get_program_accounts(
        NAME_TOKENIZER_ID, filters=filters
    )
