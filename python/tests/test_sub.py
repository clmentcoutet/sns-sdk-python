import os

import pytest
from solana.rpc.async_api import AsyncClient
from solders.null_signer import NullSigner
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from bindings.create_subdomain import create_subdomain
from bindings.transfer_subdomain import transfer_subdomain
from constants import VAULT_OWNER
from instructions.transfer_instruction import transfer_instruction
from resolve.resolve import resolve
from transactions import create_versioned_transaction
from utils import get_domain_key, find_subdomains


@pytest.mark.asyncio
async def test_create_sub(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA")
    ix = await create_subdomain(
        connection,
        f"{os.urandom(10).hex()}.bonfida",
        owner,
        2_000
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        ix,
        owner,
        blockhash
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.asyncio
async def test_transfer_sub(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("4rjVGVgPNrfgzMf9GsjZJpwdJ4HbSf9z1gfbqECdrJ1X")
    parent_owner = Pubkey.from_string("4rjVGVgPNrfgzMf9GsjZJpwdJ4HbSf9z1gfbqECdrJ1X")
    new_owner = Pubkey.default()
    subdomain = "test.0x33.sol"
    ix = await transfer_subdomain(
        connection,
        subdomain,
        new_owner,
        False
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(
        [ix],
        owner,
        blockhash,
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None

    ix = await transfer_subdomain(
        connection,
        subdomain,
        new_owner,
        True,
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(
        [ix],
        parent_owner,
        blockhash,
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.asyncio
async def test_find_subdomain(connection_url):
    connection = AsyncClient(connection_url)
    subs = await find_subdomains(
        connection,
        get_domain_key("bonfida")["pubkey"]
    )
    expected_subs = ["dex", "naming", "test"]
    assert set(subs) == set(expected_subs)


@pytest.mark.asyncio
async def test_create_sub_fee_payer(connection_url):
    connection = AsyncClient(connection_url)
    sub = "gvbhnjklmjnhb"
    parent = "bonfida.sol"
    fee_payer = VAULT_OWNER

    parent_owner = await resolve(connection, parent)

    ix = await create_subdomain(
        connection,
        f"{sub}.{parent}",
        parent_owner,
        1_000,
        fee_payer
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        ix,
        fee_payer,
        blockhash,
        [NullSigner(fee_payer), NullSigner(parent_owner)]
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None