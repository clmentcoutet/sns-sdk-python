import os

import pytest
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.null_signer import NullSigner
from solders.pubkey import Pubkey

from constants import TWITTER_ROOT_PARENT_REGISTRY_KEY, TWITTER_VERIFICATION_AUTHORITY
from transactions import create_versioned_transaction
from twitter.ReverseTwitterRegistryState import ReverseTwitterRegistryState
from twitter.create_verified_twitter_registry import create_verified_twitter_registry
from twitter.get_handle_and_registry_key import get_twitter_handle_and_registry_key
from twitter.get_twitter_handle_and_registry_key_via_filters import get_twitter_handle_and_registry_key_via_filters
from twitter.get_twitter_registry import get_twitter_registry
from twitter.get_twitter_registry_key import get_twitter_registry_key


@pytest.mark.asyncio
async def test_resolution_and_derivation(connection_url):
    connection = AsyncClient(connection_url)
    # Example randomly taken
    expected = {
        "handle": "plenthor",
        "registry": "HrguVp54KnhQcRPaEBULTRhC2PWcyGTQBfwBNVX9SW2i",
        "reverse": "C2MB7RDr4wdwSHAPZ8f5qmScYSUHdPKTL6t5meYdcjjW",
    }
    owner = Pubkey.from_string("JB27XSKgYFBsuxee5yAS2yi1NKSU6WV5GZrKdrzeTHYC")

    ########################################################################

    assert str(get_twitter_registry_key(expected["handle"])) == expected["registry"]

    ########################################################################

    twitter_registry = await get_twitter_registry(connection, expected["handle"])
    assert str(twitter_registry.owner) == str(owner)
    assert str(twitter_registry.class_name) == str(Pubkey.default())
    assert str(twitter_registry.parent_name) == str(TWITTER_ROOT_PARENT_REGISTRY_KEY)

    ########################################################################

    reverse = await ReverseTwitterRegistryState.retrieve(
        connection,
        Pubkey.from_string(expected["reverse"]),
    )
    assert reverse.handle == expected["handle"]
    assert str(Pubkey(reverse.registry)) == expected["registry"]

    ########################################################################

    handle, registry = await get_twitter_handle_and_registry_key(
        connection,
        owner,
    )
    assert handle == expected["handle"]
    assert str(registry) == expected["registry"]

    ########################################################################

    handle, registry = await get_twitter_handle_and_registry_key_via_filters(
        connection,
        owner,
    )
    assert handle == expected["handle"]
    assert str(registry) == expected["registry"]


async def test_create_instruction(connection_url):
    connection = AsyncClient(connection_url)

    handle = os.urandom(10).hex()
    user = Keypair().pubkey()
    payer = Pubkey.from_string("JB27XSKgYFBsuxee5yAS2yi1NKSU6WV5GZrKdrzeTHYC")

    ixs = await create_verified_twitter_registry(
        connection,
        handle,
        user,
        10,
        payer
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        ixs,
        payer,
        blockhash,
        signers=[NullSigner(payer), NullSigner(TWITTER_VERIFICATION_AUTHORITY)]
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None