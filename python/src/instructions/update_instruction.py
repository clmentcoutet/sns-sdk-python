from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey

from int import Numberu32


def update_instruction(
        name_program_id: Pubkey,
        name_account: Pubkey,
        offset: Numberu32,
        input_data: bytes,
        name_update_signer: Pubkey,
) -> Instruction:
    buffers = [
        bytes([1]),
        offset.to_bytes(),
        Numberu32(len(input_data)).to_bytes(),
        input_data,
    ]
    data = b"".join([bytes(buffer) for buffer in buffers])
    accounts = [
        AccountMeta(
            pubkey=name_account,
            is_signer=False,
            is_writable=True,
        ),
        AccountMeta(
            pubkey=name_update_signer,
            is_signer=True,
            is_writable=False,
        ),
    ]

    return Instruction(
        program_id=name_program_id,
        accounts=accounts,
        data=data,
    )