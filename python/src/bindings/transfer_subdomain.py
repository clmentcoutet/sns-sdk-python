from typing import Optional

from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from constants import NAME_PROGRAM_ID
from exception import InvalidSubdomainException
from instructions.transfer_instruction import transfer_instruction
from utils import get_domain_key


async def transfer_subdomain(
        connection: AsyncClient,
        subdomain: str,
        new_owner: Pubkey,
        is_parent_owner_signer: Optional[bool] = False,
        owner: Optional[Pubkey] = None
) -> Instruction:
    res = get_domain_key(subdomain)
    pubkey = res["pubkey"]
    parent = res["parent"]
    is_sub = res["is_sub"]

    if not parent or not is_sub:
        raise InvalidSubdomainException("Invalid subdomain")

    if not owner:
        registry = await NameRegistryState.retrieve(connection, pubkey)
        owner = registry.owner


    name_parent: Pubkey | None = None
    name_parent_owner: Pubkey | None = None

    if is_parent_owner_signer:
        name_parent = parent
        registry = await NameRegistryState.retrieve(connection, parent)
        name_parent_owner = registry.owner

    return transfer_instruction(
        NAME_PROGRAM_ID,
        pubkey,
        new_owner,
        owner,
        None,
        name_parent,
        name_parent_owner
    )