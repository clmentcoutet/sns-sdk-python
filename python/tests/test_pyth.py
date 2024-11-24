import pytest
from pythclient.pythclient import PythClient
from pythclient.solana import SolanaClient
from pythclient.utils import get_key

from constants import TOKENS_SYM_MINT, PYTH_FEEDS, PYTH_PULL_FEEDS
from utils import get_pyth_feed_account_key


# TODO With a better RPC client
@pytest.mark.asyncio
async def test_price_and_product_keys(connection_url):
    # Mock connection and program key
    pyth_connection = PythClient(
        solana_client=SolanaClient(endpoint=connection_url),
        first_mapping_account_key=get_key("mainnet", "mapping")
    )

    data = await pyth_connection.get_products()
    # Iterate through the tokens and verify product and price keys
    for mint, symbol in TOKENS_SYM_MINT.items():
        price_data = data["productPrice"].get(f"Crypto.{symbol}/USD")
        product_data = data["productFromSymbol"].get(f"Crypto.{symbol}/USD")

        expected_feed = PYTH_FEEDS.get(mint)
        assert price_data["productAccountKey"].to_base58() == expected_feed["product"]
        assert product_data["price_account"] == expected_feed["price"]


def test_pyth_pull_derivation():
    items = [
        {
            "mint": "So11111111111111111111111111111111111111112",
            "key": "7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE",
        },
        {
            "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "key": "Dpw1EAVrSB1ibxiDQyTAW6Zip3J4Btk2x4SgApQCeFbX",
        },
        {
            "mint": "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So",
            "key": "5CKzb9j4ChgLUt8Gfm5CNGLN6khXKiqMbnGAW4cgXgxK",
        },
        {
            "mint": "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp",
            "key": "2cfmeuVBf7bvBJcjKBQgAwfvpUvdZV7K8NZxUEuccrub",
        },
    ]
    for entry in items:
        mint = entry["mint"]
        expected_key = entry["key"]

        # Fetch the corresponding feed data from PYTH_PULL_FEEDS
        feed_data = PYTH_PULL_FEEDS.get(mint)
        assert feed_data is not None

        # Call the mocked `get_pyth_feed_account_key` function
        derived_key, _ = get_pyth_feed_account_key(0, feed_data)

        # Assert the derived key matches the expected key
        assert str(derived_key) == expected_key