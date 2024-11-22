import ipaddress

import idna
from bech32 import bech32_decode
from solders.pubkey import Pubkey

from custom_types.record import RECORD_V1_SIZE, Record
from exception import (
    UnsupportedRecordException,
    InvalidEvmAddressException,
    InvalidARecordException,
    InvalidAAAARecordException,
    InvalidRecordInputException, InvalidInjectiveAddressException,
)
from utils.check import check


async def serialize_record(
    string: str,
    record: Record,
) -> bytes:
    size = RECORD_V1_SIZE.get(record)
    if not size:
        if record == Record.CNAME or record == Record.TXT:
            string = idna.encode(string).decode()
        return string.encode()

    if record == Record.SOL:
        raise UnsupportedRecordException("Use `serialize_sol_record` for SOL record")

    elif record == Record.ETH or record == Record.BSC:
        check(
            string.startswith("0x"),
            InvalidEvmAddressException("The record content must start with `0x`"),
        )
        return bytes.fromhex(string[2:])

    elif record == Record.Injective:
        hrp, data = bech32_decode(string)
        check(
            hrp == "inj",
            InvalidInjectiveAddressException("The record content must start with `inj`"),
        )
        check(
            len(data) == 20,
            InvalidInjectiveAddressException("The record content must be 20 bytes long"),
        )
        return bytes(data)

    elif record == Record.A:
        array = ipaddress.ip_address(string).packed
        check(
            len(array) == 4,
            InvalidARecordException("The record content must be 4 bytes long"),
        )
        return array

    elif record == Record.AAAA:
        array = ipaddress.ip_address(string).packed
        check(
            len(array) == 16,
            InvalidAAAARecordException("The record content must be 16 bytes long"),
        )
        return array

    elif record == Record.Background:
        return bytes(Pubkey.from_string(string))

    else:
        raise InvalidRecordInputException("The provided record data is invalid")
