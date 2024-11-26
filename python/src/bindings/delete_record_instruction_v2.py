from solders.instruction import Instruction
from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import Record
from sns_records.bindings import delete_record
from sns_records.constants import SNS_RECORDS_ID


def delete_record_instruction_v2(
    domain: str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
) -> Instruction:
    res = get_base_instruction_data_v2(domain, record)

    return delete_record(payer, res["parent"], owner, res["pubkey"], NAME_PROGRAM_ID, SNS_RECORDS_ID)
