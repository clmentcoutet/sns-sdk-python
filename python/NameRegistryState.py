from typing import TypedDict

from borsh_construct import CStruct, U8
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from exception import AccountDoesNotExistException
from retrieve_nft_owner import retrieve_nft_owner


class RetrieveResult(TypedDict):
    registry: "NameRegistryState"
    nft_owner: Pubkey


class NameRegistryState:
    HEADER_LEN = 96

    SCHEMA = CStruct(
        "parent_name" / U8[32],
        "owner" / U8[32],
        "class_name" / U8[32],
    )

    def __init__(self, parent_name: bytes, owner: bytes, class_name: bytes):
        self.parent_name = Pubkey(parent_name)
        self.owner = Pubkey(owner)
        self.class_name = Pubkey(class_name)
        self.data: bytes = b""

    def __repr__(self):
        return f"NameRegistryState(parent_name={self.parent_name}, owner={self.owner}, class_name={self.class_name})"

    @classmethod
    async def retrieve(
        cls, connection: AsyncClient, name_account_key: Pubkey
    ) -> RetrieveResult:
        name_account = await connection.get_account_info(
            name_account_key, encoding="base64"
        )
        if name_account is None or name_account.value is None:
            raise AccountDoesNotExistException(
                f"Account {name_account_key} does not exist"
            )

        parsed = cls.SCHEMA.parse(name_account.value.data)
        res = NameRegistryState(parsed.parent_name, parsed.owner, parsed.class_name)
        res.data = name_account.value.data[cls.HEADER_LEN :]

        nft_owner = await retrieve_nft_owner(connection, res.owner)

        return {"registry": res, "nft_owner": nft_owner}
