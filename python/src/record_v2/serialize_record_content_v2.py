import base64
import ipaddress

from bech32 import bech32_decode, convertbits
from solders.pubkey import Pubkey

from custom_types import Record
from exception import (
    InvalidEvmAddressException,
    InvalidInjectiveAddressException,
    InvalidARecordException,
    InvalidAAAARecordException,
    InvalidRecordInputException,
)
from record_v2.constants import UTF8_ENCODED, EVM_RECORDS
from utils import check


def serialize_record_content_v2(
    string: str,
    record: Record,
) -> bytes:
    if record in UTF8_ENCODED:
        if record == Record.CNAME or record == Record.TXT:
            string = base64.b64encode(string.encode("utf-8")).decode("ascii")
        return string.encode()
    elif record == Record.SOL:
        return bytes(Pubkey.from_string(string))
    elif record in EVM_RECORDS:
        check(
            string.startswith("0x"),
            InvalidEvmAddressException("The record content must start with `0x`"),
        )
        return bytes.fromhex(string[2:])
    elif record == Record.Injective:
        hrp, data = bech32_decode(string)
        if data is None:
            raise InvalidInjectiveAddressException("Invalid bech32 string")
        bytes_data = convertbits(data, 5, 8, False)
        if bytes_data is None:
            raise InvalidInjectiveAddressException("Invalid bech32 string")
        check(
            hrp == "inj",
            InvalidInjectiveAddressException(
                "The record content must start with `inj`"
            ),
        )
        check(
            len(bytes_data) == 20,
            InvalidInjectiveAddressException(
                "The record content must be 20 bytes long"
            ),
        )
        return bytes(bytes_data)
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
    else:
        raise InvalidRecordInputException(f"Unsupported record type: {record}")
