from typing import Optional

from borsh_construct import CStruct, U8
from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey


class RegisterFavoriteInstruction:
    TAG = 6
    SCHEMA = CStruct(
        "tag" / U8,
    )

    @classmethod
    def serialize(cls) -> bytes:
        return cls.SCHEMA.build(dict(tag=cls.TAG))

    @classmethod
    def get_instruction(
        cls,
        program_id: Pubkey,
        name_account: Pubkey,
        favorite_account: Pubkey,
        owner: Pubkey,
        system_program: Pubkey,
        opt_parent: Optional[Pubkey] = None,
    ) -> Instruction:
        data = cls.serialize()

        accounts = [
            AccountMeta(
                pubkey=name_account,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=favorite_account,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=owner,
                is_signer=True,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=system_program,
                is_signer=False,
                is_writable=False,
            ),
        ]

        if opt_parent:
            accounts.append(
                AccountMeta(
                    pubkey=opt_parent,
                    is_signer=False,
                    is_writable=False,
                )
            )

        return Instruction(
            program_id=program_id,
            accounts=accounts,
            data=data,
        )
