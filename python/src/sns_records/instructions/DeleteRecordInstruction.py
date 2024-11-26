from borsh_construct import CStruct, U8
from solders.pubkey import Pubkey
from solders.instruction import AccountMeta, Instruction

from sns_records.instructions.BaseInstruction import BaseInstruction


class DeleteRecordInstruction(BaseInstruction):
    def __init__(self):
        super().__init__(tag=5)

    def schema(self) -> CStruct:
        return CStruct(
        "tag" / U8,
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
