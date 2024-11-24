from solders.instruction import Instruction
from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import RecordVersion, Record
from exception import InvalidParentException
from record_v2.serialize_record_content_v2 import serialize_record_content_v2
from sns_records.bindings import edit_record, SNS_RECORDS_ID
from utils import get_domain_key


async def update_record_instruction_v2(
    domain: str, record: Record, content: str, owner: Pubkey, payer: Pubkey
) -> Instruction:
    pubkey, parent, is_sub = get_base_instruction_data_v2(domain, record)

    return edit_record(
        payer,
        pubkey,
        parent,
        owner,
        NAME_PROGRAM_ID,
        f"\x02{record.value}",
        serialize_record_content_v2(content, record),
        SNS_RECORDS_ID,
    )
