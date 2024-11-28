from typing import TypedDict, Tuple, List

from borsh_construct import CStruct, U8
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from spl.token.instructions import get_associated_token_address

from NameRegistryState import NameRegistryState
from constants import NAME_OFFERS_ID, ROOT_DOMAIN_ACCOUNT, NAME_PROGRAM_ID
from exception import FavouriteDomainNotFoundException
from nft import retrieve_nft_owner
from nft.AccountLayout import ACCOUNT_LAYOUT
from nft.get_domain_mint import get_domain_mint
from utils import reverse_lookup, deserialize_reverse
from utils.get_reverse_key_from_domain_key import get_reverse_key_from_domain_key


class GetFavoriteDomainResp(TypedDict):
    domain: Pubkey
    reverse: str
    stale: bool


class FavoriteDomain:
    SCHEMA = CStruct("tag" / U8, "name_account" / U8[32])

    def __init__(self, tag: int, name_account: bytes):
        self.tag = tag
        self.name_account = name_account

    @classmethod
    def deserialize(cls, data: bytes) -> "FavoriteDomain":
        res = cls.SCHEMA.parse(data)
        return cls(res.tag, res.name_account)

    @classmethod
    async def retrieve(cls, connection: AsyncClient, key: Pubkey) -> "FavoriteDomain":
        account_info = await connection.get_account_info(key)
        if not account_info or not account_info.value:
            raise FavouriteDomainNotFoundException(
                "The favourite account does not exist"
            )
        return cls.deserialize(account_info.value.data)

    @classmethod
    def get_key(cls, program_id: Pubkey, owner: Pubkey) -> Tuple[Pubkey, int]:
        return Pubkey.find_program_address(
            ["favourite_domain".encode(), bytes(owner)],
            program_id,
        )


async def get_favorite_domain(
    connection: AsyncClient,
    owner: Pubkey,
) -> GetFavoriteDomainResp:
    favorite_key, _ = FavoriteDomain.get_key(NAME_OFFERS_ID, owner)
    favorite = await FavoriteDomain.retrieve(connection, favorite_key)
    registry = await NameRegistryState.retrieve(
        connection, Pubkey(favorite.name_account)
    )
    nft_owner = await retrieve_nft_owner(connection, Pubkey(favorite.name_account))

    domain_owner = nft_owner if nft_owner else registry.owner

    parent_name_bool = registry.parent_name == ROOT_DOMAIN_ACCOUNT
    reverse = await reverse_lookup(
        connection,
        Pubkey(favorite.name_account),
        None if parent_name_bool else registry.parent_name,
    )

    if not parent_name_bool:
        parent_reverse = await reverse_lookup(connection, registry.parent_name)
        reverse = f"{reverse}.{parent_reverse}"

    return {
        "domain": Pubkey(favorite.name_account),
        "reverse": reverse,
        "stale": not domain_owner == owner,
    }


async def get_multiple_favorite_domains(
    connection: AsyncClient, wallets: List[Pubkey]
) -> List[str | None]:
    res: List[str | None] = []

    fav_keys = [FavoriteDomain.get_key(NAME_OFFERS_ID, wallet)[0] for wallet in wallets]

    accounts_info = await connection.get_multiple_accounts(fav_keys)
    fav_domains: List[Pubkey] = [
        Pubkey(FavoriteDomain.deserialize(e.data).name_account)
        if e and e.data
        else Pubkey.default()
        for e in accounts_info.value
    ]
    domains_info = await connection.get_multiple_accounts(fav_domains)
    parents_reverse_keys: List[Pubkey] = []
    reverse_keys: List[Pubkey] = []
    for i, elem in enumerate(domains_info.value):
        parent = (
            Pubkey(elem.data[:32])
            if elem and elem.data and len(elem.data) >= 32
            else Pubkey.default()
        )
        is_sub = (
            elem and elem.owner == NAME_PROGRAM_ID and not parent == ROOT_DOMAIN_ACCOUNT
        )
        parents_reverse_keys.append(
            get_reverse_key_from_domain_key(parent) if is_sub else Pubkey.default()
        )
        reverse_keys.append(
            get_reverse_key_from_domain_key(fav_domains[i], parent if is_sub else None)
        )
    atas = [
        get_associated_token_address(wallets[i], get_domain_mint(elem))
        for i, elem in enumerate(fav_domains)
    ]

    reverses = await connection.get_multiple_accounts(reverse_keys)
    token_accounts = await connection.get_multiple_accounts(atas)
    parents_reverses = await connection.get_multiple_accounts(parents_reverse_keys)
    for i, wallet in enumerate(wallets):
        parent_reverse = ""
        domain_info = domains_info.value[i]
        reverse = reverses.value[i]
        token_account = token_accounts.value[i]
        parent_reverse_account = parents_reverses.value[i]

        if not domain_info or not reverse:
            res.append(None)
            continue

        if parent_reverse_account and parent_reverse_account.owner == NAME_PROGRAM_ID:
            des = deserialize_reverse(parent_reverse_account.data[96:])
            parent_reverse += f".{des}"

        native_owner = Pubkey(domain_info.data[32:64])
        if native_owner == wallet:
            res.append(deserialize_reverse(reverse.data[96:], True) + parent_reverse)
            continue

        if not token_account:
            res.append(None)
            continue

        decoded = ACCOUNT_LAYOUT.parse(token_account.data)
        if decoded.amount == 1:
            res.append(deserialize_reverse(reverse.data[96:]) + parent_reverse)
            continue

        res.append(None)
    return res
