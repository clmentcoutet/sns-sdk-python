from typing import List
from borsh_construct import CStruct, U8, U32, String
from solders.pubkey import Pubkey
from solders.instruction import AccountMeta, Instruction

from sns_records.instructions.BaseInstruction import BaseInstruction


class AllocateRecordInstruction(BaseInstruction):
    def __init__(self, record: str, content_length: int):
        super().__init__(tag=0)
        self.record = record
        self.content_length = content_length

    def schema(self) -> CStruct:
        return CStruct(
        "tag" / U8,
        "content_length" / U32,
        "record" / String,
    )

    def get_instruction(
        self,
        program_id: Pubkey,
        system_program: Pubkey,
        spl_name_service_program: Pubkey,
        fee_payer: Pubkey,
        record: Pubkey,
        domain: Pubkey,
        domain_owner: Pubkey,
        central_state: Pubkey
    ) -> Instruction:
        accounts = [
            AccountMeta(pubkey=system_program, is_signer=False, is_writable=False),
            AccountMeta(pubkey=spl_name_service_program, is_signer=False, is_writable=False),
            AccountMeta(pubkey=fee_payer, is_signer=True, is_writable=True),
            AccountMeta(pubkey=record, is_signer=False, is_writable=True),
            AccountMeta(pubkey=domain, is_signer=False, is_writable=True),
            AccountMeta(pubkey=domain_owner, is_signer=True, is_writable=True),
            AccountMeta(pubkey=central_state, is_signer=False, is_writable=False),
        ]

        return self.create_instruction(program_id=program_id, accounts=accounts)
