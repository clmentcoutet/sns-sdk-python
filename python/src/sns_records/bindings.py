from solders.instruction import Instruction
from solders.pubkey import Pubkey

from sns_records.state import Validation

SNS_RECORDS_ID: Pubkey = Pubkey.default()

CENTRAL_STATE_SNS_RECORDS: Pubkey = Pubkey.default()


def allocate_and_post_record(
    fee_payer: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    name_program_id: Pubkey,
    record: str,
    content: bytes,
    program_id: Pubkey,
) -> Instruction:
    pass


def allocate_record(
    fee_payer: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    name_program_id: Pubkey,
    record: str,
    content_length: int,
    program_id: Pubkey,
) -> Instruction:
    pass


def delete_record(
    fee_payer: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    record_key: Pubkey,
    name_program_id: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    pass


def edit_record(
    fee_payer: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    name_program_id: Pubkey,
    record: str,
    content: bytes,
    program_id: Pubkey,
) -> Instruction:
    pass


def validate_eth_signature(
    fee_payer: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    name_program_id: Pubkey,
    validation: Validation,
    signature: bytes,
    expected_pubkey: bytes,
    program_id: Pubkey,
) -> Instruction:
    pass


def validate_solana_signature(
    fee_payer: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    verifier: Pubkey,
    name_program_id: Pubkey,
    staleness: bool,
    program_id: Pubkey,
) -> Instruction:
    pass


def write_roa(
    fee_payer: Pubkey,
    name_program_id: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    roa_id: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    pass


def unverify_roa(
    fee_payer: Pubkey,
    name_program_id: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    verifier: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    pass
