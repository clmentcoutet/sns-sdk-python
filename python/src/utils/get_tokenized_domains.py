from typing import TypedDict

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from nft.retrieve_records import retrieve_records
from utils import reverse_lookup_batch


class GetTokenizedDomainResp(TypedDict):
    key: str
    mint: str
    reverse: str


async def get_tokenized_domains(connection: AsyncClient, owner: Pubkey):
    nft_records = await retrieve_records(connection, owner)

    names = await reverse_lookup_batch(
        connection, [record.name_account for record in nft_records]
    )

    return [
        GetTokenizedDomainResp(
            key=nft_records[idx].name_account,
            mint=nft_records[idx].nft_mint,
            reverse=e,
        )
        for idx, e in enumerate(names)
        if e
    ]
