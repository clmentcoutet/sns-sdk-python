from dis import Instruction
from typing import List

from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import NAME_PROGRAM_ID, TWITTER_ROOT_PARENT_REGISTRY_KEY, TWITTER_VERIFICATION_AUTHORITY
from instructions import create_instruction
from int import Numberu64, Numberu32
from twitter.create_reverse_twitter_registry import create_reverse_twitter_registry
from twitter.get_twitter_registry_key import get_twitter_registry_key
from utils import get_hashed_name, get_name_account_key


async def create_verified_twitter_registry(
        connection: AsyncClient,
        twitter_handle: str,
        verified_pubkey: Pubkey,
        space: int,
        payer: Pubkey,
) -> List[Instruction]:
    hashed_twitter_handle = get_hashed_name(twitter_handle)
    twitter_handle_registry = get_name_account_key(
        hashed_twitter_handle,
        None,
        TWITTER_ROOT_PARENT_REGISTRY_KEY
    )

    lamports = await connection.get_minimum_balance_for_rent_exemption(
        space + NameRegistryState.HEADER_LEN
    )
    if lamports is None:
        raise Exception("Failed to get minimum balance for rent exemption")

    ixs = [
        create_instruction(
            NAME_PROGRAM_ID,
            SYSTEM_PROGRAM_ID,
            twitter_handle_registry,
            verified_pubkey,
            payer,
            hashed_twitter_handle,
            Numberu64(lamports.value),
            Numberu32(space),
            None,
            TWITTER_ROOT_PARENT_REGISTRY_KEY,
            TWITTER_VERIFICATION_AUTHORITY
        )
    ]

    ix_create_registry = await create_reverse_twitter_registry(
        connection,
        twitter_handle,
        twitter_handle_registry,
        verified_pubkey,
        payer
    )
    ixs.extend(ix_create_registry)
    return ixs

