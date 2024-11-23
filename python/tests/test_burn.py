from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from bindings import burn_domain
from transactions import create_versioned_transaction


async def test_burn(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("3Wnd5Df69KitZfUoPYZU438eFRNwGHkhLnSAWL65PxJX")

    ix = burn_domain(
        "1automotive",
        owner,
        owner
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction(
        [ix],
        owner,
        blockhash
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None