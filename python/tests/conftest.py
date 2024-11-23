import os
import sys
from pathlib import Path

from dotenv import load_dotenv
import pytest
from solders.pubkey import Pubkey


load_dotenv("python/.env.dev")
# Add src directory to Python path
src_path = Path(__file__).parent.parent / "src"
sys.path.append(str(src_path))


@pytest.fixture(scope="session", autouse=True)
def connection_url():
    private_key = os.getenv("PRIVATE_KEY")
    if not private_key:
        raise ValueError("PRIVATE_KEY is not set in the .env.dev file")
    return private_key


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
