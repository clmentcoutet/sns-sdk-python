from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import NAME_PROGRAM_ID
from custom_types.record import Record, RecordVersion
from exception import UnsupportedRecordException, NoLamportsDataException
from instructions.create_instruction import create_instruction
from int import Numberu64, Numberu32
from record.serialize_record import serialize_record
from utils.check import check
from utils.get_domain_key import get_domain_key


async def create_record_instruction(
    connection: AsyncClient,
    domain: str,
    record: Record,
    data: str,
    owner: Pubkey,
    payer: Pubkey,
) -> Instruction:
    """
    This function can be used be create a record V1, it handles the serialization of the record data
    To create a SOL record use `createSolRecordInstruction`
    :param connection: The Solana RPC connection object
    :param domain: The .sol domain name
    :param record: The record enum object
    :param data: The data (as a UTF-8 string) to store in the record account
    :param owner: The owner of the domain
    :param payer: The fee payer of the transaction
    :return:
    """
    check(
        record != Record.SOL,
        UnsupportedRecordException("SOL record is not supported for this instruction"),
    )
    res = get_domain_key(f"{record.value}.{domain}", RecordVersion.V1)
    pubkey = res["pubkey"]
    hashed = res["hashed"]
    parent = res["parent"]

    serialized = await serialize_record(data, record)
    space = len(serialized)
    lamports = await connection.get_minimum_balance_for_rent_exemption(
        space + NameRegistryState.HEADER_LEN
    )

    if lamports is None:
        raise NoLamportsDataException(
            "Failed to get minimum balance for rent exemption"
        )

    return create_instruction(
        NAME_PROGRAM_ID,
        SYSTEM_PROGRAM_ID,
        pubkey,
        owner,
        payer,
        hashed,
        Numberu64(lamports.value),
        Numberu32(space),
        None,
        parent,
        owner,
    )
