import pytest
from solders.pubkey import Pubkey


@pytest.fixture(scope="session", autouse=True)
def connection_url():
    return "https://quaint-cold-snow.solana-mainnet.quiknode.pro/39ddb64963c9a34975f35d7508d67751de89e1a2"


@pytest.fixture(scope="session", autouse=True)
def domain_key():
    return Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb")


@pytest.fixture(scope="session", autouse=True)
def subdomain_key():
    return Pubkey.from_string("HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu")


@pytest.fixture(scope="session", autouse=True)
def record_subdomain_key():
    return Pubkey.from_string("6qDaoiF6Mr2TE1iL6STpvrUZktJixFvKwFRRbfCAtdzx")


@pytest.fixture(scope="session", autouse=True)
def domain_name():
    return "bonfida.sol"


@pytest.fixture(scope="session", autouse=True)
def subdomain_name():
    return "dex.bonfida.sol"


@pytest.fixture(scope="session", autouse=True)
def record_subdomain_name():
    return "IPFS.bonfida.sol"
