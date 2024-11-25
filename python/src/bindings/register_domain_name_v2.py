from typing import Optional, List

from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey
from spl.token.constants import TOKEN_PROGRAM_ID
from spl.token.instructions import get_associated_token_address, create_idempotent_associated_token_account

from constants import USDC_MINT, ROOT_DOMAIN_ACCOUNT, CENTRAL_STATE, REGISTER_PROGRAM_ID, REFERRERS, VAULT_OWNER, \
    PYTH_PULL_FEEDS, NAME_PROGRAM_ID, SYSVAR_RENT_PUBKEY
from exception import InvalidDomainException, PythFeedNotFoundException
from instructions.CreateSplitInstructionV2 import CreateSplitInstructionV2
from utils import get_hashed_name, get_name_account_key, get_pyth_feed_account_key


async def register_domain_name_v2(
        connection: AsyncClient,
        name: str,
        space: int,
        buyer: Pubkey,
        buyer_token_account: Pubkey,
        mint: Pubkey = USDC_MINT,
        referrer_key: Optional[Pubkey] = None,
) -> List[Instruction]:
    if "." in name or name.strip().lower() != name:
        raise InvalidDomainException("The domain name in malformed")

    hashed = get_hashed_name(name)
    name_account = get_name_account_key(
        hashed,
        None,
        ROOT_DOMAIN_ACCOUNT
    )

    hashed_reverse_lookup = get_hashed_name(str(name_account))
    reverse_lookup_account = get_name_account_key(
        hashed_reverse_lookup,
        CENTRAL_STATE
    )

    derived_state, _ = Pubkey.find_program_address(
        [bytes(name_account)],
        REGISTER_PROGRAM_ID
    )

    ref_index = next((i for i, e in enumerate(REFERRERS)
                    if referrer_key and referrer_key == e))
    ref_token_account: Pubkey | None = None

    ixs: List[Instruction] = []

    if ref_index != -1 and referrer_key:
        ref_token_account = get_associated_token_address(
            mint,
            referrer_key,
        )
        account = await connection.get_account_info(ref_token_account)
        if account.value is None or account.value.data is None:
            ix = create_idempotent_associated_token_account(
                buyer,
                referrer_key,
                mint
            )
            ixs.append(ix)

    vault = get_associated_token_address(
        mint,
        VAULT_OWNER
    )
    pyth_feed = PYTH_PULL_FEEDS.get(str(mint))

    if not pyth_feed:
        raise PythFeedNotFoundException(
            "The Pyth account for the provided mint was not found"
        )

    pyth_feed_account, _ = get_pyth_feed_account_key(0, pyth_feed)

    ix = CreateSplitInstructionV2(
        name, space, referrer_index=ref_index if ref_index != -1 else None
    ).get_instruction(
        REGISTER_PROGRAM_ID,
        NAME_PROGRAM_ID,
        ROOT_DOMAIN_ACCOUNT,
        name_account,
        reverse_lookup_account,
        SYSTEM_PROGRAM_ID,
        CENTRAL_STATE,
        buyer,
        buyer,
        buyer,
        buyer_token_account,
        pyth_feed_account,
        vault,
        TOKEN_PROGRAM_ID,
        SYSVAR_RENT_PUBKEY,
        derived_state,
        ref_token_account
    )
    ixs.append(ix)

    return ixs