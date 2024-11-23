import base64
import ipaddress
import base58
from bech32 import bech32_decode, convertbits, bech32_encode
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from exception import InvalidRecordDataException
from record.check_sol_record import check_sol_record
from custom_types.record import Record, RECORD_V1_SIZE


def _trim_null_padding_idx(buffer: bytes) -> int:
    """Find the last non-null byte in the buffer."""
    return len(buffer) - next(
        (i for i, byte in enumerate(reversed(buffer)) if byte != 0), len(buffer)
    )


def _is_valid_ip(address: str) -> bool:
    """Validate if the provided string is a valid IP address."""
    try:
        ipaddress.ip_address(address)
        return True
    except ValueError:
        return False


def _process_utf8_record(buffer: bytes, idx: int, record: Record) -> str:
    """Process UTF-8 encoded records like CNAME and TXT."""
    str_data = buffer[:idx].decode("utf-8")
    if record in [Record.CNAME, Record.TXT]:
        return base64.b64decode(str_data).decode("utf-8")
    return str_data


def _process_sol_record(
    buffer: bytes, record_key: Pubkey, registry: NameRegistryState
) -> str | None:
    """Handle the special case for SOL records."""
    expected_buffer = buffer[:32] + bytes(record_key)
    expected = expected_buffer.hex().encode("utf-8")
    valid = check_sol_record(expected, buffer[32:96], registry.owner)
    if valid:
        return base58.b58encode(buffer[:32]).decode("utf-8")
    return None


def _process_old_record(buffer: bytes, idx: int, record: Record) -> str | None:
    """Process old records with specific formats."""
    address = buffer[:idx].decode("utf-8")
    if record == Record.Injective:
        hrp, data = bech32_decode(address)
        if not data:
            raise InvalidRecordDataException("The record data is malformed")
        res = convertbits(data, 5, 8, False)
        if hrp == "inj" and res and len(bytes(res)) == 20:
            return address
    elif record in [Record.BSC, Record.ETH]:
        if address.startswith("0x") and len(bytes.fromhex(address[2:])) == 20:
            return address
    elif record in [Record.A, Record.AAAA]:
        if _is_valid_ip(address):
            return address
    raise InvalidRecordDataException("The record data is malformed")


def _process_current_record(buffer: bytes, size: int, record: Record) -> str | None:
    """Process modern record formats."""
    if record in [Record.ETH, Record.BSC]:
        return "0x" + buffer[:size].hex()
    elif record == Record.Injective:
        bech32_data = convertbits(buffer[:size], 8, 5, True)
        if not bech32_data:
            raise InvalidRecordDataException("The record data is malformed")
        return bech32_encode("inj", bech32_data)
    elif record in [Record.A, Record.AAAA]:
        return str(ipaddress.ip_address(buffer[:size]))
    elif record == Record.Background:
        return str(Pubkey(buffer[:size]))
    raise InvalidRecordDataException("The record data is malformed")


def deserialize_record(
    registry: NameRegistryState | None,
    record: Record,
    record_key: Pubkey,
) -> str | None:
    """
    Deserialize a record based on its type and format.
    """
    if not registry:
        return None
    buffer = registry.data
    if not buffer or buffer == bytes(len(buffer)):
        return None

    size = RECORD_V1_SIZE.get(record)
    idx = _trim_null_padding_idx(buffer)

    # Handle UTF-8 encoded records
    if not size:
        return _process_utf8_record(buffer, idx, record)

    # Handle SOL record (special case)
    if record == Record.SOL:
        sol_result = _process_sol_record(buffer, record_key, registry)
        if sol_result:
            return sol_result

    # Handle old record formats
    if size and idx != size:
        return _process_old_record(buffer, idx, record)

    # Handle modern record formats
    return _process_current_record(buffer, size, record)
