# Test cases for favorite domain
import pytest
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey

from bindings import register_favorite
from favorite_domain import get_favorite_domain, get_multiple_favorite_domains
from transactions import create_versioned_transaction
from utils import get_domain_key

TEST_CASES = [
    (
        Pubkey.from_string("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
        {
            "domain": Pubkey.from_string(
                "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"
            ),
            "reverse": "bonfida",
            "stale": True,
        },
    ),
    (
        Pubkey.from_string("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
        {
            "domain": Pubkey.from_string(
                "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"
            ),
            "reverse": "bonfida",
            "stale": False,  # TODO Should be True ?
        },
    ),
    (
        Pubkey.from_string("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
        {
            "domain": Pubkey.from_string(
                "BaQq8Uib3Aw5SPBedC8MdYCvpfEC9iLkUMHc5M74sAjv"
            ),
            "reverse": "1.00728",
            "stale": False,
        },
    ),
]


@pytest.mark.asyncio
@pytest.mark.parametrize("user, expected_favorite", TEST_CASES)
async def test_favorite_domain(user, expected_favorite, connection_url):
    # Initialize the connection
    connection = AsyncClient(connection_url)

    # Call the function under test
    fav = await get_favorite_domain(connection, user)

    # Assertions
    assert fav["domain"] == expected_favorite["domain"]
    assert fav["reverse"] == expected_favorite["reverse"]
    assert fav["stale"] == expected_favorite["stale"]

    # Close the connection after test
    await connection.close()


@pytest.mark.asyncio
async def test_multiple_favorite_domains(connection_url):
    connection = AsyncClient(connection_url)

    # Test data
    items = [
        # Non-tokenized
        {
            "wallet": Pubkey.from_string(
                "HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"
            ),
            "domain": "bonfida",
        },
        # Stale non-tokenized
        {
            "wallet": Pubkey.from_string(
                "FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"
            ),
            "domain": None,
        },
        # Random pubkey
        {"wallet": Keypair().pubkey(), "domain": None},
        # Tokenized
        {
            "wallet": Pubkey.from_string(
                "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"
            ),
            "domain": "fav-tokenized",
        },
        {
            "wallet": Pubkey.from_string(
                "A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"
            ),
            "domain": "1.00728",
        },
    ]

    # Call the function under test
    result = await get_multiple_favorite_domains(
        connection, [item["wallet"] for item in items]
    )

    # Assert the results
    for idx, expected in enumerate(items):
        assert result[idx] == expected["domain"]

    # Close the connection after test
    await connection.close()


async def test_register_fav(connection_url):
    connection = AsyncClient(connection_url)
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")
    ix = await register_favorite(
        connection, get_domain_key("wallet-guide-3")["pubkey"], owner
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix], owner, blockhash)

    res = await connection.simulate_transaction(tx)
    print(res)
    assert res.value.err is None
