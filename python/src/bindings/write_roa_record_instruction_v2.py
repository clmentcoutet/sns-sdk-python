from solders.instruction import Instruction
from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import Record
from sns_records.bindings import write_roa
from sns_records.constants import SNS_RECORDS_ID


def write_roa_record_instruction_v2(
    domain: str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    road_id: Pubkey,
) -> Instruction:
    res = get_base_instruction_data_v2(domain, record)

    return write_roa(
        payer, NAME_PROGRAM_ID, res["pubkey"], res["parent"], owner, road_id, SNS_RECORDS_ID
    )
