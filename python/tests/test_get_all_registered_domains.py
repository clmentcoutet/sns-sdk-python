import pytest
from solana.rpc.async_api import AsyncClient

from get_all_registered_domains import get_all_registered_domains
from tests.fixture import connection_url

@pytest.mark.asyncio
async def test_get_all_registered_domains(connection_url):
    connection = AsyncClient(connection_url)
    accounts = await get_all_registered_domains(connection)
    assert len(accounts.value) > 130_000