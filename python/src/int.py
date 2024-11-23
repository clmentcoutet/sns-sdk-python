import struct
from abc import ABC
from typing import Union, ClassVar, Type

from exception import InvalidBufferLengthException, U64OverflowException


class NumberuBase(ABC):
    # Class variables to be defined in child classes
    STRUCT_FORMAT: ClassVar[str]
    BYTES_LENGTH: ClassVar[int]
    MAX_VALUE: ClassVar[int]
    BUFFER_ERROR: ClassVar[Type[Exception]]

    def __init__(self, value: Union[int, str]):
        # Convert input to int
        if isinstance(value, str):
            self.value = int(value)
        else:
            self.value = value

        # Validate range
        if not 0 <= self.value <= self.MAX_VALUE:
            raise ValueError(
                f"Value must be a {self.BYTES_LENGTH * 8}-bit unsigned integer"
            )

    def to_buffer(self) -> bytes:
        """Convert to bytes representation"""
        return struct.pack(self.STRUCT_FORMAT, self.value)

    @classmethod
    def from_buffer(cls, buffer: bytes) -> "NumberuBase":
        """Construct a number from bytes representation"""
        if len(buffer) != cls.BYTES_LENGTH:
            raise cls.BUFFER_ERROR(f"Invalid buffer length: {len(buffer)}")

        value = struct.unpack(cls.STRUCT_FORMAT, buffer)[0]
        return cls(value)

    def to_number(self) -> int:
        """Convert to integer"""
        return self.value

    def __str__(self) -> str:
        return str(self.value)


class Numberu32(NumberuBase):
    STRUCT_FORMAT = "<I"
    BYTES_LENGTH = 4
    MAX_VALUE = 0xFFFFFFFF
    BUFFER_ERROR = InvalidBufferLengthException


class Numberu64(NumberuBase):
    STRUCT_FORMAT = "<Q"
    BYTES_LENGTH = 8
    MAX_VALUE = 0xFFFFFFFFFFFFFFFF
    BUFFER_ERROR = U64OverflowException
