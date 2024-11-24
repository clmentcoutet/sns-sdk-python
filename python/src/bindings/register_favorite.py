from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import ROOT_DOMAIN_ACCOUNT, NAME_OFFERS_ID
from favorite_domain import FavoriteDomain
from instructions import RegisterFavoriteInstruction


async def register_favorite(
    connection: AsyncClient,
    name_account: Pubkey,
    owner: Pubkey,
) -> Instruction:
    parent: Pubkey | None = None
    registry = await NameRegistryState.retrieve(
        connection,
        name_account,
    )
    if registry.parent_name != ROOT_DOMAIN_ACCOUNT:
        parent = registry.parent_name

    favorite_key, _ = FavoriteDomain.get_key(NAME_OFFERS_ID, owner)

    return RegisterFavoriteInstruction.get_instruction(
        NAME_OFFERS_ID,
        name_account,
        favorite_key,
        owner,
        SYSTEM_PROGRAM_ID,
        parent,
    )
