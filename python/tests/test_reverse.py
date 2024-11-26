import pytest
from solana.rpc.async_api import AsyncClient

from bindings.create_subdomain import create_subdomain
from resolve.resolve import resolve
from transactions import create_versioned_transaction


@pytest.mark.asyncio
async def test_create_sub(connection_url):
    connection = AsyncClient(connection_url)
    sub = "gvbhnjklmjnhb"
    parent = "bonfida.sol"

    parent_owner = await resolve(connection, parent)

    ix = await create_subdomain(
        connection,
        f"{sub}.{parent}",
        parent_owner,
        1_000
    )

    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(
        ix,
        parent_owner,
        blockhash
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None

