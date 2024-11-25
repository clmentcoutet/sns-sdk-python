from typing import Union, Literal, TypedDict, List, Optional

from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from typing_extensions import NotRequired

from NameRegistryState import NameRegistryState
from constants import SIGNATURE_LENGTH_IN_BYTES
from custom_types import Record
from exception import DomainDoesNotExistException, CouldNotFindNftOwnerException, NoAccountDataException, \
    PdaOwnerNotAllowedException
from nft import retrieve_nft_owner
from nft.constants import NAME_TOKENIZER_ID
from nft.state import NftRecord, Tag
from record import get_record_key, check_sol_record
from record_v2.get_record_key_v2 import get_record_key_v2
from utils import get_domain_key

AllowPda = Union[Literal["any"], bool]


class ResolveConfig(TypedDict):
    allow_pda: AllowPda
    program_ids: NotRequired[List[Pubkey]]


async def resolve(
        connection: AsyncClient,
        domain: str,
        config: Optional[ResolveConfig] = None
) -> Pubkey:
    if config is None:
        config = {"allow_pda": False}

    pubkey = get_domain_key(domain)["pubkey"]
    nft_record_key, _ = await NftRecord.find_key(pubkey, NAME_TOKENIZER_ID)
    sol_record_key_v1 = get_record_key(domain, Record.SOL)
    sol_record_key_v2 = get_record_key_v2(domain, Record.SOL)

    res = await connection.get_multiple_accounts(
        [nft_record_key, sol_record_key_v1, sol_record_key_v2, pubkey]
    )
    nft_record_info = res.value[0]
    sol_record_info_v1 = res.value[1]
    sol_record_info_v2 = res.value[2]
    registry_info = res.value[3]

    if not registry_info.data:
        raise DomainDoesNotExistException(f"Domain does not exist: {domain}")

    registry = NameRegistryState.deserialize(registry_info.data)

    if nft_record_info and nft_record_info.data:
        nft_record = NftRecord.deserialize(nft_record_info.data)
        if nft_record.tag == Tag.active_record:
            nft_owner = await retrieve_nft_owner(connection, pubkey)
            if nft_owner is None:
                raise CouldNotFindNftOwnerException(f"Could not find NFT owner for domain: {domain}")

    # TODO: Check SOL record V2 (needs bonfida/sns-records)
    if sol_record_info_v2 and sol_record_info_v2.data:
        raise NotImplementedError("SOL record V2 is not implemented")

    # Check SOL record V1
    if sol_record_info_v1 and sol_record_info_v1.data:
        expected_buffer = sol_record_info_v1.data[
            NameRegistryState.HEADER_LEN:NameRegistryState.HEADER_LEN + 32
            ] + bytes(sol_record_key_v1)

        expected = expected_buffer.hex().encode()
        valid = check_sol_record(
            expected,
            sol_record_info_v1.data[
            NameRegistryState.HEADER_LEN + 32:
            NameRegistryState.HEADER_LEN + 32 + SIGNATURE_LENGTH_IN_BYTES
            ],
            registry.owner,
        )
        if valid:
            return Pubkey(
                sol_record_info_v1.data[
                NameRegistryState.HEADER_LEN:NameRegistryState.HEADER_LEN + 32
                ]
            )

    # Check if the registry owner is a PDA
    is_on_curve = Pubkey.is_on_curve(registry.owner)
    if not is_on_curve:
        if config["allow_pda"] == "any":
            return registry.owner
        elif config["allow_pda"]:
            owner_info = await connection.get_account_info(registry.owner)
            if owner_info.value is None:
                raise NoAccountDataException(f"No account data for PDA: {registry.owner}")
            is_allowed = any(
                e == owner_info.value.owner for e in config.get("program_ids", [])
            )
            if is_allowed:
                return registry.owner
            raise PdaOwnerNotAllowedException(
                f"PDA owner not allowed: {owner_info.value.owner}"
            )
        else:
            raise PdaOwnerNotAllowedException()

    return registry.owner