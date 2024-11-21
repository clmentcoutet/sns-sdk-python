import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from get_domain_keys_with_reverses import get_domain_keys_with_reverses

item = {
    "user": Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
    "pubkey": [
        "9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r",
        "CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm",
        "ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT",
        "2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR",
        "6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw",
        "8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS",
    ],
    "domain": [
        "wallet-guide-10",
        "wallet-guide-3",
        "wallet-guide-4",
        "wallet-guide-6",
        "wallet-guide-7",
        "wallet-guide-9",
    ],
}


@pytest.mark.asyncio
async def test_get_domain_keys_reverses(connection_url):
    connection = AsyncClient(connection_url)
    domains = await get_domain_keys_with_reverses(connection, item["user"])
    domains.sort(key=lambda x: x["domain"])

    for index, domain in enumerate(domains):
        assert domain["pubkey"] == Pubkey.from_string(item["pubkey"][index])
        assert domain["domain"] == item["domain"][index]
