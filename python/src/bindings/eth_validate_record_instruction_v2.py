from solders.instruction import Instruction
from solders.pubkey import Pubkey

from bindings.get_base_instruction_data import get_base_instruction_data_v2
from constants import NAME_PROGRAM_ID
from custom_types import Record
from sns_records.bindings import validate_eth_signature
from bindings.constants import SNS_RECORDS_ID
from sns_records.state import Validation


def eth_validate_record_instruction_v2(
    domain: str,
    record: Record,
    owner: Pubkey,
    payer: Pubkey,
    signature: bytes,
    expected_pubkey: bytes,
) -> Instruction:
    res = get_base_instruction_data_v2(domain, record)

    return validate_eth_signature(
        payer,
        res["pubkey"],
        res["parent"],
        owner,
        NAME_PROGRAM_ID,
        Validation.Ethereum,
        signature,
        expected_pubkey,
        SNS_RECORDS_ID,
    )
