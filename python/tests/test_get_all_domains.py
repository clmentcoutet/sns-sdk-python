import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from utils.get_all_domains import get_all_domains

item = {
    "user": Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
    "domain": [
        Pubkey.from_string("2NsGScxHd9bS6gA7tfY3xucCcg6H9qDqLdXLtAYFjCVR"),
        Pubkey.from_string("6Yi9GyJKoFAv77pny4nxBqYYwFaAZ8dNPZX9HDXw5Ctw"),
        Pubkey.from_string("8XXesVR1EEsCEePAEyXPL9A4dd9Bayhu9MRkFBpTkibS"),
        Pubkey.from_string("9wcWEXmtUbmiAaWdhQ1nSaZ1cmDVdbYNbaeDcKoK5H8r"),
        Pubkey.from_string("CZFQJkE2uBqdwHH53kBT6UStyfcbCWzh6WHwRRtaLgrm"),
        Pubkey.from_string("ChkcdTKgyVsrLuD9zkUBoUkZ1GdZjTHEmgh5dhnR4haT"),
    ],
}


@pytest.mark.asyncio
async def test_get_all_domains(connection_url):
    connection = AsyncClient(connection_url)
    result = await get_all_domains(connection, item["user"])
    result.sort()
    for i, j in zip(result, item["domain"]):
        assert i == j
