import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from get_domain_key import get_domain_key
from record import RecordVersion
from reverse_lookup import reverse_lookup


@pytest.mark.asyncio
async def test_reverse_lookup():
    connection = AsyncClient(
        "https://quaint-cold-snow.solana-mainnet.quiknode.pro/39ddb64963c9a34975f35d7508d67751de89e1a2"
    )
    name_account = Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb")
    parent = None
    result = await reverse_lookup(connection, name_account, parent)
    assert result == "bonfida"


def test_get_domain_key():
    domain = "bonfida.sol"
    result = get_domain_key(domain)
    assert result["pubkey"] == Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb")

def test_get_subdomain_key():
    domain = "dex.bonfida.sol"
    result = get_domain_key(domain)
    assert result["pubkey"] == Pubkey.from_string("HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu")
    assert result["parent"] == Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb")

def test_get_recordsubdomain_key():
    domain = "IPFS.bonfida.sol"
    result = get_domain_key(domain, RecordVersion.V1)
    assert result["pubkey"] == Pubkey.from_string("6qDaoiF6Mr2TE1iL6STpvrUZktJixFvKwFRRbfCAtdzx")
    assert result["parent"] == Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb")