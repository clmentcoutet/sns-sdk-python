from solders.instruction import Instruction
from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import Record, RecordVersion
from exception import InvalidParentException
from sns_records.bindings import delete_record, SNS_RECORDS_ID
from utils import get_domain_key


async def delete_record_instruction_v2(
    domain: str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
) -> Instruction:
    pubkey, parent, is_sub = get_base_instruction_data_v2(domain, record)

    return delete_record(payer, parent, owner, pubkey, NAME_PROGRAM_ID, SNS_RECORDS_ID)
