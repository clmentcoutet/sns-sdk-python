from enum import Enum
from typing import Tuple

from borsh_construct import CStruct, U8
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from exception import NftRecordNotFoundException


class Tag(Enum):
    Uninitialized = 0,
    CentralState = 1,
    ActiveRecord = 2,
    InactiveRecord = 3,


class NftRecord:
    LEN = 1 + 1 + 32 + 32 + 32
    SCHEMA = CStruct(
        "tag" / U8,
        "nonce" / U8,
        "name_account" / U8[32],
        "owner" / U8[32],
        "nft_mint" / U8[32],
    )

    def __init__(
            self,
            tag: Tag,
            nonce: int,
            name_account: bytes,
            owner: bytes, nft_mint: bytes
    ):
        self.tag = tag
        self.nonce = nonce
        self.name_account = name_account
        self.owner = owner
        self.nft_mint = nft_mint

    @classmethod
    def deserialize(cls, data: bytes) -> "NftRecord":
        return cls.SCHEMA.deserialize(data)

    @classmethod
    async def retrieve(
            cls,
            connection: AsyncClient,
            key: Pubkey
    ) -> "NftRecord":
        account_info = await connection.get_account_info(key)
        if not account_info or not account_info.value:
            raise NftRecordNotFoundException(
                f"NFT record not found: {str(key)}"
            )
        return cls.deserialize(account_info.value.data)

    @classmethod
    async def find_key(
            cls,
            name_account: Pubkey,
            program_id: Pubkey
    ) -> Tuple[Pubkey, int]:
        return Pubkey.find_program_address(
            ["nft_record".encode(), bytes(name_account)],
            program_id
        )