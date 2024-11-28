from typing import List

from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import TWITTER_VERIFICATION_AUTHORITY, TWITTER_ROOT_PARENT_REGISTRY_KEY, NAME_PROGRAM_ID
from exception import NoLamportsDataException
from instructions import create_instruction
from instructions.update_instruction import update_instruction
from int import Numberu64, Numberu32
from twitter.ReverseTwitterRegistryState import ReverseTwitterRegistryState
from utils import get_hashed_name, get_name_account_key


async def create_reverse_twitter_registry(
        connection: AsyncClient,
        twitter_handle: str,
        twitter_registry: Pubkey,
        verified_pubkey: Pubkey,
        payer: Pubkey,
) -> List[Instruction]:
    hashed_verified_pubkey = get_hashed_name(str(verified_pubkey))
    reverse_registry = get_name_account_key(
        hashed_verified_pubkey,
        TWITTER_VERIFICATION_AUTHORITY,
        TWITTER_ROOT_PARENT_REGISTRY_KEY
    )

    reverse_twitter_registry_state_bytes = ReverseTwitterRegistryState.serialize(
        ReverseTwitterRegistryState(
            handle=twitter_handle,
            registry=bytes(twitter_registry),
        )
    )
    space = len(reverse_twitter_registry_state_bytes)
    lamports = await connection.get_minimum_balance_for_rent_exemption(
        space + NameRegistryState.HEADER_LEN
    )
    if lamports.value is None:
        raise NoLamportsDataException("Failed to get minimum balance for rent exemption")

    ix_create = create_instruction(
        NAME_PROGRAM_ID,
        SYSTEM_PROGRAM_ID,
        reverse_registry,
        verified_pubkey,
        payer,
        hashed_verified_pubkey,
        Numberu64(lamports.value),
        Numberu32(space),
        TWITTER_VERIFICATION_AUTHORITY,
        TWITTER_ROOT_PARENT_REGISTRY_KEY,
        TWITTER_VERIFICATION_AUTHORITY
    )

    ix_update = update_instruction(
        NAME_PROGRAM_ID,
        reverse_registry,
        Numberu32(0),
        reverse_twitter_registry_state_bytes,
        TWITTER_VERIFICATION_AUTHORITY
    )

    return [ix_create, ix_update]