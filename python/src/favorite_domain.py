from typing import TypedDict, Tuple

from borsh_construct import CStruct, Bytes, U8
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import NAME_OFFERS_ID
from exception import FavouriteDomainNotFoundException
from nft import retrieve_nft_owner


class GetFavoriteDomainResp(TypedDict):
    domain: Pubkey
    reverse: str
    stale: bool


class FavoriteDomain:
    SCHEMA = CStruct(
        "tag" / U8,
        "name_account" / Bytes(32),
    )

    def __init__(self, tag: int, name_account: bytes):
        self.tag = tag
        self.name_account = name_account

    @classmethod
    def deserialize(cls, data: bytes) -> "FavoriteDomain":
        return cls(*cls.SCHEMA.deserialize(data))

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> 'FavoriteDomain':
        account_info = await connection.get_account_info(key)
        if not account_info and not account_info.value:
            raise FavouriteDomainNotFoundException(
                "The favourite account does not exist"
            )
        return cls.deserialize(account_info.value.data)

    @classmethod
    def get_key(cls, program_id: Pubkey, owner: Pubkey) -> Tuple[Pubkey, int]:
        return Pubkey.find_program_address(
            ["favourite_domain".encode(), bytes(owner)],
            program_id,
        )


async def get_favorite_domain(
        connection: AsyncClient,
        owner: Pubkey,
) -> GetFavoriteDomainResp:
    favorite_key, _ = FavoriteDomain.get_key(
        NAME_OFFERS_ID,
        owner
    )
    favorite = await FavoriteDomain.retrieve(connection, favorite_key)
    registry = await NameRegistryState.retrieve(
        connection,
        Pubkey.from_bytes(favorite.name_account)
    )
    nft_owner = await retrieve_nft_owner(connection, owner)

    domain_owner =