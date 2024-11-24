from dis import Instruction

from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import Record, RecordVersion
from exception import InvalidParentException
from sns_records.bindings import validate_solana_signature, SNS_RECORDS_ID
from utils import get_domain_key


def validate_record_instruction_v2(
    staleness: bool,
    domain: str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    verifier: Pubkey,
) -> Instruction:
    pubkey, parent, is_sub = get_base_instruction_data_v2(domain, record)

    return validate_solana_signature(
        payer,
        pubkey,
        parent,
        owner,
        verifier,
        NAME_PROGRAM_ID,
        staleness,
        SNS_RECORDS_ID,
    )
