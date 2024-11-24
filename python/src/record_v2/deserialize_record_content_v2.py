import base64
import ipaddress

from bech32 import convertbits, bech32_encode
from solders.pubkey import Pubkey

from custom_types import Record
from exception import InvalidRecordDataException
from record_v2.constants import UTF8_ENCODED, EVM_RECORDS


def deserialize_record_content_v2(content: bytes, record: Record) -> str:
    if record in UTF8_ENCODED:
        decoded = content.decode()
        if record == Record.CNAME or record == Record.TXT:
            return base64.b64decode(decoded).decode("utf-8")
        return decoded
    elif record == Record.SOL:
        return str(Pubkey(content))
    elif record in EVM_RECORDS:
        return f"0x{content.hex()}"
    elif record == Record.Injective:
        bech32_data = convertbits(content, 8, 5, True)
        if not bech32_data:
            raise InvalidRecordDataException("The record data is malformed")
        return bech32_encode("inj", bech32_data)
    elif record == Record.A or record == Record.AAAA:
        return str(ipaddress.ip_address(content))
    else:
        raise InvalidRecordDataException("The record data is malformed")
