from typing import Optional

from borsh_construct import CStruct, U8, U32, U16, String, Option
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey


class CreateSplitInstructionV2:
    TAG: int = 20
    NAME: str = ""
    SPACE: int = 0
    REFERRER_INDEX: int | None = None
    SCHEMA = CStruct(
        "tag" / U8,
        "name" / String,
        "space" / U32,
        "referrer_index_opt" / Option(U16),
    )

    def __init__(self, name: str, space: int, referrer_index: int | None = None):
        self.NAME = name
        self.SPACE = space
        self.REFERRER_INDEX = referrer_index

    def serialize(self) -> bytes:
        if not self.NAME or not self.SPACE:
            raise ValueError("Name and space must be set")
        return self.SCHEMA.build(
            {
                "tag": self.TAG,
                "name": self.NAME,
                "space": self.SPACE,
                "referrer_index_opt": self.REFERRER_INDEX,
            }
        )

    def get_instruction(
        self,
        program_id: Pubkey,
        naming_service_program: Pubkey,
        root_domain: Pubkey,
        name: Pubkey,
        reverse_lookup: Pubkey,
        system_program: Pubkey,
        central_state: Pubkey,
        buyer: Pubkey,
        domain_owner: Pubkey,
        fee_payer: Pubkey,
        buyer_token_source: Pubkey,
        pyth_feed_account: Pubkey,
        vault: Pubkey,
        spl_token_program: Pubkey,
        rent_sysvar: Pubkey,
        state: Pubkey,
        referrer_account_opt: Optional[Pubkey],
    ) -> Instruction:
        data = self.serialize()

        accounts = [
            AccountMeta(
                pubkey=naming_service_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=root_domain,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=name,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=reverse_lookup,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=system_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=central_state,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=buyer,
                is_signer=True,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=domain_owner,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=fee_payer,
                is_signer=True,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=buyer_token_source,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=pyth_feed_account,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=vault,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=spl_token_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=rent_sysvar,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=state,
                is_signer=False,
                is_writable=False,
            ),
        ]

        if referrer_account_opt:
            accounts.append(
                AccountMeta(
                    pubkey=referrer_account_opt,
                    is_signer=False,
                    is_writable=True,
                )
            )
        return Instruction(
            program_id=program_id,
            accounts=accounts,
            data=data,
        )
