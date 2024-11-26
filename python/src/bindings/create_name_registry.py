from typing import Optional

from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from constants import NAME_PROGRAM_ID
from instructions import create_instruction
from int import Numberu64, Numberu32
from resolve.resolve import resolve
from utils import get_hashed_name, get_name_account_key, reverse_lookup


async def create_name_registry(
        connection: AsyncClient,
        name: str,
        space: int,
        payer_key: Pubkey,
        name_owner: Pubkey,
        lamports: Optional[int] = None,
        name_class: Optional[Pubkey] = None,
        parent_name: Optional[Pubkey] = None,
) -> Instruction:
    hashed_name = get_hashed_name(name)
    name_account_key = get_name_account_key(
        hashed_name,
        name_class,
        parent_name,
    )

    balance = lamports \
        if lamports is not None \
        else await connection.get_minimum_balance_for_rent_exemption(space)

    name_parent_owner: Pubkey | None = None
    if parent_name is not None:
        domain = await reverse_lookup(connection, parent_name)
        name_parent_owner = await resolve(connection, domain, {"allow_pda": "any"})

    return create_instruction(
        NAME_PROGRAM_ID,
        SYSTEM_PROGRAM_ID,
        name_account_key,
        name_owner,
        payer_key,
        hashed_name,
        Numberu64(balance),
        Numberu32(space),
        name_class,
        parent_name,
        name_parent_owner
    )
