import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from nft.get_domain_mint import get_domain_mint
from utils import get_tokenized_domains, get_domain_key

items = [
    {
        "owner": Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        "domains": [
            {
                "key": "iSNVgWfb31aTWa58UxZ6fp7n3TTrUk5Gojggub5stXk",
                "mint": "2RJhBbxTiPT2bZq5bhjaTZbsnhbDB7VtTAMmCdBrwBZP",
                "reverse": "wallet-guide-5",
            },
            {
                "key": "uDTBDfKrJSBTgmWUZLcENPk5YrHfWbcrUbNFLjsvNpn",
                "mint": "Eskv5Ns4gyREvNPPgANojNPsz6x1cbn9YwT7esAnxPhP",
                "reverse": "wallet-guide-0",
            },
        ],
    },
]
@pytest.mark.asyncio
async def test_get_tokenized_domains(connection_url):
    connection = AsyncClient(connection_url)
    owner_pubkey = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    # Fetch tokenized domains
    domains = await get_tokenized_domains(connection, owner_pubkey)
    # Map the result to match the structure (similar to JavaScript's .map())
    domains = [
        {
            "key": domain["key"].to_base58(),
            "mint": domain["mint"].to_base58(),
            "reverse": domain["reverse"]
        }
        for domain in domains
    ]

    # Sort the domains by 'reverse' field (like in JavaScript's localeCompare)
    domains.sort(key=lambda x: x["reverse"], reverse=True)

    # Compare the sorted domains with the mock 'items' domains
    for item in items:
        assert domains == item["domains"]


# Parameterized test cases
@pytest.mark.parametrize("domain, expected_address", [
    ("domain1.sol", "3YTxXhhVue9BVjgjPwJbbJ4uGPsnwN453DDf72rYE5WN"),
    ("sub.domain2.sol", "66CnogoXDBqYeYRGYzQf19VyrMnB4uGxpZQDuDYfbKCX"),
])
def test_get_domain_mint(domain, expected_address):
    pubkey = get_domain_key(domain)["pubkey"]
    result = str(get_domain_mint(pubkey))
    assert result == expected_address