from enum import Enum
from typing import Literal, List, Union

from borsh_construct import CStruct, U16, U32
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from sns_records.constants import NAME_REGISTRY_LEN


class Validation(Enum):
    Null = 0
    Solana = 1
    Ethereum = 2
    UnverifiedSolana = 3


def get_validation_length(validation: Validation) -> Literal[0, 20, 32]:
    match validation:
        case Validation.Null:
            return 0
        case Validation.Solana:
            return 32
        case Validation.Ethereum:
            return 20
        case Validation.UnverifiedSolana:
            return 32
        case _:
            raise ValueError("Invalid validation type")

class RecordHeader:
    LEN = 8
    SCHEMA = CStruct(
        "staleness_validation" / U16,
        "right_of_association_validation" / U16,
        "content_length" / U32,
    )

    def __init__(
        self, staleness_validation: int, roa_validation: int, content_length: int
    ):
        self.staleness_validation = staleness_validation
        self.right_of_association_validation = roa_validation
        self.content_length = content_length

    @classmethod
    def deserialize(cls, data: bytes) -> "RecordHeader":
        res = cls.SCHEMA.parse(data)
        return cls(res.staleness_validation, res.right_of_association_validation, res.content_length)

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> "RecordHeader":
        info = await connection.get_account_info(key)
        if info.value is None or info.value.data is None:
            raise ValueError("Record header account not found")
        return cls.deserialize(info.value.data[NAME_REGISTRY_LEN:NAME_REGISTRY_LEN + cls.LEN])


class Record:
    def __init__(self, header: RecordHeader, data: bytes):
        self.header = header
        self.data = data

    @classmethod
    def deserialize(cls, data: bytes) -> "Record":
        offset = NAME_REGISTRY_LEN
        header = RecordHeader.deserialize(data[offset : offset + RecordHeader.LEN])
        data = data[offset + RecordHeader.LEN:]
        return cls(header, data)

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> "Record":
        info = await connection.get_account_info(key)
        if info.value is None or info.value.data is None:
            raise ValueError("Record account not found")
        return cls.deserialize(info.value.data)

    def __repr__(self):
        res = f"Record(header={self.header}, data={self.data.hex()})"
        res += f"Header: {self.header.staleness_validation}, {self.header.right_of_association_validation}, {self.header.content_length}"
        return res

    @classmethod
    async def retrieve_batch(
        cls, connection: AsyncClient, keys: List[Pubkey]
    ) -> List[Union["Record", None]]:
        infos = await connection.get_multiple_accounts(keys)
        return [
            cls.deserialize(info.data) if info is not None else None
            for info in infos.value
        ]

    def get_content(self) -> bytes:
        start_offset = (
            get_validation_length(Validation(self.header.staleness_validation))+
            get_validation_length(Validation(self.header.right_of_association_validation))
        )
        return self.data[start_offset:]

    def get_staleness_id(self) -> bytes:
        end_offset = get_validation_length(Validation(self.header.staleness_validation))
        return self.data[:end_offset]

    def get_roa_id(self) -> bytes:
        start_offset = get_validation_length(Validation(self.header.staleness_validation))
        end_offset = start_offset + get_validation_length(Validation(self.header.right_of_association_validation))
        return self.data[start_offset:end_offset]
