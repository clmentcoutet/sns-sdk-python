import asyncio
from typing import List

from solana.rpc.async_api import AsyncClient
from solana.rpc.types import MemcmpOpts, DataSliceOpts
from solders.account import Account
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID

from nft.AccountLayout import ACCOUNT_LAYOUT
from nft.get_record_from_mint import get_record_from_mint
from nft.state import NftRecord


def _get_filter(owner: str) -> List[MemcmpOpts]:
    return [
        MemcmpOpts(offset=8, bytes=owner),
        MemcmpOpts(offset=8, bytes="2")
    ]


async def _closure(
        connection: AsyncClient,
        mint: Pubkey,
) -> NftRecord | None:
    record = await get_record_from_mint(connection, mint)
    if record and len(record.value) == 0:
        return NftRecord.deserialize(record.value[0].account.data)


async def retrieve_records(
        connection: AsyncClient,
        owner: Pubkey,
):
    filters: List[MemcmpOpts | int] = [
        *_get_filter(str(owner)),
        165
    ]

    res = await connection.get_program_accounts(
        TOKEN_PROGRAM_ID, filters=filters
    )

    token_accounts = [ACCOUNT_LAYOUT.decode(e.account.data) for e in res.value]

    promises = [_closure(connection, acc) for acc in token_accounts]
    records = await asyncio.gather(*promises)

    return [e for e in records if e is not None]