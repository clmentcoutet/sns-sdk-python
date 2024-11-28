from typing import Optional

from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey

from int import Numberu64, Numberu32


def create_instruction(
    name_program_id: Pubkey,
    system_program_id: Pubkey,
    name: Pubkey,
    name_owner: Pubkey,
    payer: Pubkey,
    hashed_name: bytes,
    lamports: Numberu64,
    space: Numberu32,
    name_class: Optional[Pubkey],
    name_parent: Optional[Pubkey],
    name_parent_owner: Optional[Pubkey],
) -> Instruction:
    buffers = [
        bytes([0]),
        Numberu32(len(hashed_name)).to_bytes(),
        hashed_name,
        lamports.to_bytes(),
        space.to_bytes(),
    ]

    data = b"".join(buffers)

    accounts = [
        AccountMeta(pubkey=system_program_id, is_signer=False, is_writable=False),
        AccountMeta(pubkey=payer, is_signer=True, is_writable=True),
        AccountMeta(pubkey=name, is_signer=False, is_writable=True),
        AccountMeta(pubkey=name_owner, is_signer=False, is_writable=False),
    ]

    if name_class:
        accounts.append(
            AccountMeta(pubkey=name_class, is_signer=True, is_writable=False)
        )
    else:
        accounts.append(
            AccountMeta(pubkey=Pubkey([0] * 32), is_signer=False, is_writable=False)
        )
    if name_parent:
        accounts.append(
            AccountMeta(pubkey=name_parent, is_signer=False, is_writable=False)
        )
    else:
        accounts.append(
            AccountMeta(pubkey=Pubkey([0] * 32), is_signer=False, is_writable=False)
        )
    if name_parent_owner:
        accounts.append(
            AccountMeta(pubkey=name_parent_owner, is_signer=True, is_writable=False)
        )

    return Instruction(
        program_id=name_program_id,
        accounts=accounts,
        data=data,
    )
