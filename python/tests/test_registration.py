import os

import pytest
from solana.rpc.async_api import AsyncClient
from solders.null_signer import NullSigner
from solders.pubkey import Pubkey
from spl.token.instructions import get_associated_token_address

from bindings.register_domain_name_v2 import register_domain_name_v2
from bindings.register_with_nft import register_with_nft
from constants import REFERRERS
from transactions import create_versioned_transaction
from utils import get_domain_key, get_reverse_key


@pytest.mark.skip(reason="Metaplex SDK in not available on Python")
@pytest.mark.asyncio
async def test_registration_with_nft(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR")
    domain = os.urandom(10).hex()
    pubkey = get_domain_key(domain)["pubkey"]
    reverse = get_reverse_key(domain)
    holder = Pubkey.from_string("FiUYY19eXuVcEAHSJ87KEzYjYnfKZm6KbHoVtdQBNGfk")
    source = Pubkey.from_string("Df9Jz3NrGVd5jjjrXbedwuHbCc1hL131bUXq2143tTfQ")

    nft_mint = Pubkey.from_string("7cpq5U6ze5PPcTPVxGifXA8xyDp8rgAJQNwBDj8eWd8w")
    nft_metadata = Pubkey.default()
    master_edition = Pubkey.default()

    ix = await register_with_nft(
        domain,
        1_000,
        pubkey,
        reverse,
        holder,
        source,
        nft_metadata,
        nft_mint,
        master_edition,
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        [ix],
        owner,
        blockhash,
        signers=[NullSigner(owner), NullSigner(holder)]
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.asyncio
async def test_indempotent_ata_creation_ref(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR")
    pyth_mint = Pubkey.from_string("HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3")
    ixs = []
    for i in range(3):
        ix = await register_domain_name_v2(
            connection,
            os.urandom(10).hex(),
            1_000,
            owner,
            get_associated_token_address(owner, pyth_mint),
            pyth_mint,
            REFERRERS[0],
        )
        ixs.extend(ix)
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(ixs, owner, blockhash, signers=[NullSigner(owner)])
    res = await connection.simulate_transaction(tx)
    print(res)
    assert res.value.err is None


@pytest.mark.asyncio
async def test_register_v2(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR")
    fida_mint = Pubkey.from_string("EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp")
    ix = await register_domain_name_v2(
        connection,
        os.urandom(10).hex(),
        1_000,
        owner,
        get_associated_token_address(owner, fida_mint),
        fida_mint,
        REFERRERS[0],
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(ix, owner, blockhash, signers=[NullSigner(owner)])
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.asyncio
async def test_register_v2_with_referrer(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("5D2zKog251d6KPCyFyLMt3KroWwXXPWSgTPyhV22K2gR")
    fida_mint = Pubkey.from_string("EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp")
    ix = await register_domain_name_v2(
        connection,
        os.urandom(10).hex(),
        1_000,
        owner,
        get_associated_token_address(owner, fida_mint),
        fida_mint,
        REFERRERS[1],
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(ix, owner, blockhash, signers=[NullSigner(owner)])
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None