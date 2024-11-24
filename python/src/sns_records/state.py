from enum import Enum
from typing import Literal, List, Union

from borsh_construct import CStruct
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey


class Validation(Enum):
    Null = 0
    Solana = 1
    Ethereum = 2
    UnverifiedSolana = 3


def get_validation_length(
        validation: Validation
) -> Literal[0, 20, 32]:
    pass


class RecordHeader:
    LEN: int
    SCHEMA: CStruct

    def __init__(self, staleness_validation: int, roa_validation: int, content_length: int):
        self.staleness_validation = staleness_validation
        self.right_of_association_validation = roa_validation
        self.content_length = content_length

    @classmethod
    def deserialize(cls, data: bytes) -> 'RecordHeader':
        pass

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> 'RecordHeader':
        pass


class Record:
    def __init__(self, header: RecordHeader, data: bytes):
        self.header = header
        self.data = data

    @classmethod
    def deserialize(cls, data: bytes) -> 'Record':
        pass

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> 'Record':
        pass

    @classmethod
    async def retrieve_batch(cls, connection: AsyncClient, keys: List[Pubkey]) -> List[Union['Record', None]]:
        pass

    def get_content(self) -> bytes:
        pass

    def get_staleness_id(self) -> bytes:
        pass

    def get_roa_id(self) -> bytes:
        pass