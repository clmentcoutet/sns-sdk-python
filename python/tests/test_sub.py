import os

from solana.rpc.async_api import AsyncClient
from solders.null_signer import NullSigner
from solders.pubkey import Pubkey

from bindings.create_subdomain import create_subdomain
from bindings.transfer_subdomain import transfer_subdomain
from transactions import create_versioned_transaction


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


async def test_transfer_sub(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk")
    parent_owner = Pubkey.from_string("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk")
    new_owner = Pubkey.default()
    ix = await transfer_subdomain(
        connection,
        "test.0x33.sol",
        new_owner,
        False
    )

    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        [ix],
        owner,
        blockhash,
        signers=[NullSigner(owner), NullSigner(parent_owner)]
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None
