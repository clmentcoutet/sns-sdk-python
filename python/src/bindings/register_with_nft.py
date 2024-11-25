from solana.constants import SYSTEM_PROGRAM_ID
from solders.instruction import Instruction
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID

from constants import REGISTER_PROGRAM_ID, NAME_PROGRAM_ID, ROOT_DOMAIN_ACCOUNT, REVERSE_LOOKUP_CLASS, \
    WOLVES_COLLECTION_METADATA, METAPLEX_ID, SYSVAR_RENT_PUBKEY
from instructions.CreateWithNftInstruction import CreateWithNftInstruction


async def register_with_nft(
        name: str,
        space: int,
        name_account: Pubkey,
        reverse_lookup_account: Pubkey,
        buyer: Pubkey,
        nft_source: Pubkey,
        nft_metadata: Pubkey,
        nft_mint: Pubkey,
        master_edition: Pubkey,
) -> Instruction:
    state, _ = Pubkey.find_program_address(
        [bytes(name_account)],
        REGISTER_PROGRAM_ID
    )

    return CreateWithNftInstruction(name, space).get_instruction(
        REGISTER_PROGRAM_ID,
        NAME_PROGRAM_ID,
        ROOT_DOMAIN_ACCOUNT,
        name_account,
        reverse_lookup_account,
        SYSTEM_PROGRAM_ID,
        REVERSE_LOOKUP_CLASS,
        buyer,
        nft_source,
        nft_metadata,
        nft_mint,
        master_edition,
        WOLVES_COLLECTION_METADATA,
        TOKEN_PROGRAM_ID,
        SYSVAR_RENT_PUBKEY,
        state,
        METAPLEX_ID
    )