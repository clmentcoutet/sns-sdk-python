from dis import Instruction

from solana.constants import SYSTEM_PROGRAM_ID
from solders.pubkey import Pubkey

from constants import REGISTER_PROGRAM_ID, NAME_PROGRAM_ID, REVERSE_LOOKUP_CLASS
from instructions.BurnInstruction import BurnInstruction
from utils import get_domain_key, get_reverse_key


def burn_domain(
        domain: str,
        owner: Pubkey,
        target: Pubkey,
) -> Instruction:
    pubkey = get_domain_key(domain)["pubkey"]
    state, _ = pubkey.find_program_address(
        [bytes(pubkey)],
        REGISTER_PROGRAM_ID,
    )
    reselling_state, _ = pubkey.find_program_address(
        [bytes(pubkey), bytes([1, 1])],
        REGISTER_PROGRAM_ID,
    )

    return BurnInstruction.get_instruction(
        REGISTER_PROGRAM_ID,
        NAME_PROGRAM_ID,
        SYSTEM_PROGRAM_ID,
        pubkey,
        get_reverse_key(domain),
        reselling_state,
        state,
        REVERSE_LOOKUP_CLASS,
        owner,
        target
    )
