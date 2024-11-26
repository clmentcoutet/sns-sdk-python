from typing import Optional, List

from solana.constants import SYSTEM_PROGRAM_ID
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from constants import CENTRAL_STATE, REGISTER_PROGRAM_ID, NAME_PROGRAM_ID, ROOT_DOMAIN_ACCOUNT, SYSVAR_RENT_PUBKEY
from instructions.CreateReverseInstruction import CreateReverseInstruction
from utils import get_hashed_name, get_name_account_key


async def create_reverse_name(
        name_account: Pubkey,
        name: str,
        fee_payer: Pubkey,
        parent_name: Optional[Pubkey] = None,
        parent_name_owner: Optional[Pubkey] = None,
) -> Instruction:
    hashed_reverse_lookup = get_hashed_name(str(name_account))
    reverse_lookup_account = get_name_account_key(
        hashed_reverse_lookup,
        CENTRAL_STATE,
        parent_name
    )

    return CreateReverseInstruction(
        name
    ).get_instruction(
        REGISTER_PROGRAM_ID,
        NAME_PROGRAM_ID,
        ROOT_DOMAIN_ACCOUNT,
        reverse_lookup_account,
        SYSTEM_PROGRAM_ID,
        CENTRAL_STATE,
        fee_payer,
        SYSVAR_RENT_PUBKEY,
        parent_name,
        parent_name_owner
    )

