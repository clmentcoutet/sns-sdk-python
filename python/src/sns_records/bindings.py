from solana.constants import SYSTEM_PROGRAM_ID
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from sns_records.constants import CENTRAL_STATE_SNS_RECORDS
from sns_records.instructions.AllocateAndPostRecordInstruction import AllocateAndPostRecordInstruction
from sns_records.instructions.AllocateRecordInstruction import AllocateRecordInstruction
from sns_records.instructions.DeleteRecordInstruction import DeleteRecordInstruction
from sns_records.instructions.EditRecordInstruction import EditRecordInstruction
from sns_records.instructions.UnverifyRoaInstruction import UnverifyRoaInstruction
from sns_records.instructions.ValidateEthereumSignatureInstruction import ValidateEthereumSignatureInstruction
from sns_records.instructions.ValidateSolanaSignatureInstruction import ValidateSolanaSignatureInstruction
from sns_records.instructions.WriteRoaInstruction import WriteRoaInstruction
from sns_records.state import Validation


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
    return AllocateAndPostRecordInstruction(record, list(content)).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


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
    return AllocateRecordInstruction(record, content_length).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


def delete_record(
    fee_payer: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    record_key: Pubkey,
    name_program_id: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    return DeleteRecordInstruction().get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


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
    return EditRecordInstruction(record, list(content)).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


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
    return ValidateEthereumSignatureInstruction(
        validation.value, signature, expected_pubkey
    ).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


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
    return ValidateSolanaSignatureInstruction(staleness).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS,
        verifier
    )


def write_roa(
    fee_payer: Pubkey,
    name_program_id: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    domain_owner: Pubkey,
    roa_id: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    return WriteRoaInstruction(list(bytes(roa_id))).get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        domain_owner,
        CENTRAL_STATE_SNS_RECORDS
    )


def unverify_roa(
    fee_payer: Pubkey,
    name_program_id: Pubkey,
    record_key: Pubkey,
    domain_key: Pubkey,
    verifier: Pubkey,
    program_id: Pubkey,
) -> Instruction:
    return UnverifyRoaInstruction().get_instruction(
        program_id,
        SYSTEM_PROGRAM_ID,
        name_program_id,
        fee_payer,
        record_key,
        domain_key,
        CENTRAL_STATE_SNS_RECORDS,
        verifier
    )
