from typing import Optional

from borsh_construct import CStruct, U8, String
from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey


class CreateReverseInstruction:
    TAG: int = 12
    SCHEMA = CStruct(
        "tag" / U8,
        "name" / String
    )

    def __init__(self, name: str):
        self.name = name

    def serialize(self) -> bytes:
        return self.SCHEMA.build(dict(
            tag=self.TAG,
            name=self.name
        ))

    def get_instruction(
            self,
            program_id: Pubkey,
            naming_service_program: Pubkey,
            root_domain: Pubkey,
            reverse_lookup: Pubkey,
            system_program: Pubkey,
            central_state: Pubkey,
            fee_payer: Pubkey,
            rent_sysvar: Pubkey,
            parent_name: Optional[Pubkey] = None,
            parent_name_owner: Optional[Pubkey] = None
    ) -> Instruction:
        data = self.serialize()

        accounts = [
            AccountMeta(
                pubkey=naming_service_program,
                is_signer=False,
                is_writable=False
            ),
            AccountMeta(
                pubkey=root_domain,
                is_signer=False,
                is_writable=False
            ),
            AccountMeta(
                pubkey=reverse_lookup,
                is_signer=False,
                is_writable=True
            ),
            AccountMeta(
                pubkey=system_program,
                is_signer=False,
                is_writable=False
            ),
            AccountMeta(
                pubkey=central_state,
                is_signer=False,
                is_writable=False
            ),
            AccountMeta(
                pubkey=fee_payer,
                is_signer=True,
                is_writable=True
            ),
            AccountMeta(
                pubkey=rent_sysvar,
                is_signer=False,
                is_writable=False
            )
        ]

        if parent_name:
            accounts.append(
                AccountMeta(
                    pubkey=parent_name,
                    is_signer=False,
                    is_writable=True
                )
            )

        if parent_name_owner:
            accounts.append(
                AccountMeta(
                    pubkey=parent_name_owner,
                    is_signer=True,
                    is_writable=True
                )
            )

        return Instruction(
            program_id=program_id,
            accounts=accounts,
            data=data
        )
