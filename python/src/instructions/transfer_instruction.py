from typing import Optional

from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey


def transfer_instruction(
        name_program_id: Pubkey,
        name_account: Pubkey,
        new_owner: Pubkey,
        current_name_owner: Pubkey,
        name_class: Optional[Pubkey] = None,
        name_parent: Optional[Pubkey] = None,
        parent_owner: Optional[Pubkey] = None
) -> Instruction:
    buffers = [bytes([2]), bytes(new_owner)]

    data = b''.join(buffers)

    accounts = [
        AccountMeta(
            pubkey=name_account,
            is_signer=False,
            is_writable=True
        ),
        AccountMeta(
            pubkey=parent_owner or current_name_owner,
            is_signer=True,
            is_writable=False
        ),
    ]

    if name_class:
        accounts.append(
            AccountMeta(
                pubkey=name_class,
                is_signer=True,
                is_writable=False
            )
        )

    if parent_owner and name_parent:
        accounts.append(
            AccountMeta(
                pubkey=Pubkey.default(),
                is_signer=False,
                is_writable=False
            )
        )
        accounts.append(
            AccountMeta(
                pubkey=name_parent,
                is_signer=False,
                is_writable=False
            )
        )

    return Instruction(
        program_id=name_program_id,
        accounts=accounts,
        data=data
    )