from borsh_construct import CStruct, U8, String
from solana.rpc.async_api import AsyncClient
from solana.rpc.commitment import Processed
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from exception import InvalidReverseTwitterException


class ReverseTwitterRegistryState:
    SCHEMA = CStruct(
        "registry" / U8[32],
        "handle" / String,
    )

    def __init__(self, registry: bytes, handle: str):
        self.registry = registry
        self.handle = handle

    @classmethod
    def deserialize(cls, data: bytes) -> "ReverseTwitterRegistryState":
        res = cls.SCHEMA.parse(data)
        return cls(
            registry=res.registry,
            handle=res.handle,
        )

    def serialize(self) -> bytes:
        return self.SCHEMA.build(dict(
            registry=self.registry,
            handle=self.handle,
        ))

    @classmethod
    async def retrieve(
            cls,
            connection: AsyncClient,
            reverse_account_key: Pubkey,
    ) -> "ReverseTwitterRegistryState":
        reverse_account = await connection.get_account_info(
            reverse_account_key,
            Processed
        )
        if reverse_account.value is None:
            raise InvalidReverseTwitterException(
                f"Account {reverse_account_key} not found"
            )
        return cls.deserialize(
            reverse_account.value.data[NameRegistryState.HEADER_LEN:]
        )