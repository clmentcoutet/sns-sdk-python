from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from custom_types.record import Record
from exception import NoRecordDataException, InvalidSignatureException
from record import get_sol_record
from record.check_sol_record import check_sol_record
from record.get_record_key import get_record_key


async def resolve_sol_record_v1(
    connection: AsyncClient,
    owner: Pubkey,
    domain: str,
) -> Pubkey:
    record_key = await get_record_key(domain, Record.SOL)
    sol_record = await get_sol_record(connection, domain)

    if sol_record is None or sol_record.data is None:
        raise NoRecordDataException("The SOL record V1 data is empty")

    expected_buffer = sol_record.data[:32] + bytes(record_key)
    expected = expected_buffer.hex().encode()
    valid = check_sol_record(expected, sol_record.data[32:], owner)

    if not valid:
        raise InvalidSignatureException("The SOL record V1 signature is invalid")

    return Pubkey(sol_record.data[:32])
