import pytest
from solana.rpc.async_api import AsyncClient

from reverse_lookup import reverse_lookup
from reverse_lookup_batch import reverse_lookup_batch


@pytest.mark.asyncio
async def test_reverse_lookup(connection_url, domain_key):
    connection = AsyncClient(connection_url)
    result = await reverse_lookup(connection, domain_key)
    assert result == "bonfida"


@pytest.mark.asyncio
async def test_reverse_lookup_none(connection_url, domain_key):
    connection = AsyncClient(connection_url)
    result = await reverse_lookup_batch(connection, [domain_key])
    assert result == ["bonfida"]
