from typing import Optional, List

from solana.rpc.async_api import AsyncClient
from solders.instruction import Instruction
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from bindings.create_name_registry import create_name_registry
from bindings.create_reverse_name import create_reverse_name
from exception import InvalidDomainException
from utils import get_domain_key, get_reverse_key


async def create_subdomain(
        connection: AsyncClient,
        subdomain: str,
        owner: Pubkey,
        space: Optional[int] = 2_000,
        fee_payer: Optional[Pubkey] = None,
) -> List[Instruction]:
    ixs: List[Instruction] = []
    sub = subdomain.split(".")[0]
    if not sub:
        raise InvalidDomainException("The subdomain name is malformed")

    res = get_domain_key(subdomain)
    pubkey = res["pubkey"]
    parent = res["parent"]

    lamports = await connection.get_minimum_balance_for_rent_exemption(
        space + NameRegistryState.HEADER_LEN
    )
    if lamports.value is None:
        raise Exception("Could not get minimum balance for rent exemption")

    ix_create = await create_name_registry(
        connection,
        f"\0{sub}",
        space,
        fee_payer if fee_payer else owner,
        owner,
        lamports.value,
        None,
        parent,
    )
    ixs.append(ix_create)

    reverse_key = get_reverse_key(subdomain, True)
    info = await connection.get_account_info(reverse_key)

    if info.value is None or info.value.data is None:
        ix_reverse = await create_reverse_name(
            pubkey,
            f"\0{sub}",
            fee_payer if fee_payer else owner,
            parent,
            owner
        )
        ixs.append(ix_reverse)

    return ixs

