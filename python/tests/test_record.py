import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from bindings.create_record_instruction import create_record_instruction
from custom_types.record import Record
from record.get_records import get_records
from record.helpers.get_arweave_record import get_arweave_record
from record.helpers.get_bsc_record import get_bsc_record
from record.helpers.get_btc_record import get_btc_record
from record.helpers.get_discord_record import get_discord_record
from record.helpers.get_doge_record import get_doge_record
from record.helpers.get_email_record import get_email_record
from record.helpers.get_eth_record import get_eth_record
from record.helpers.get_github_record import get_github_record
from record.helpers.get_ipfs_record import get_ipfs_record
from record.helpers.get_ltc_record import get_ltc_record
from record.helpers.get_reddit_record import get_reddit_record
from record.helpers.get_telegram_record import get_telegram_record
from record.helpers.get_twitter_record import get_twitter_record
from record.helpers.get_url_record import get_url_record
from transactions.create_versioned_transaction import create_versioned_transaction

from tests.fixture import connection_url


@pytest.mark.asyncio
async def test_get_ipfs_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    ipfs_record = await get_ipfs_record(connection, domain)
    assert ipfs_record == "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"


@pytest.mark.asyncio
async def test_get_arweave_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    arweave_record = await get_arweave_record(connection, domain)
    assert arweave_record == "some-arweave-hash"


@pytest.mark.asyncio
async def test_get_eth_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    eth_record = await get_eth_record(connection, domain)
    assert eth_record == "0x570eDC13f9D406a2b4E6477Ddf75D5E9cCF51cd6"


@pytest.mark.asyncio
async def test_get_btc_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    btc_record = await get_btc_record(connection, domain)
    assert btc_record == "3JfBcjv7TbYN9yQsyfcNeHGLcRjgoHhV3z"


@pytest.mark.asyncio
async def test_get_ltc_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    ltc_record = await get_ltc_record(connection, domain)
    assert ltc_record == "MK6deR3Mi6dUsim9M3GPDG2xfSeSAgSrpQ"


@pytest.mark.asyncio
async def test_get_doge_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    doge_record = await get_doge_record(connection, domain)
    assert doge_record == "DC79kjg58VfDZeMj9cWNqGuDfYfGJg9DjZ"


@pytest.mark.asyncio
async def test_get_email_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    email_record = await get_email_record(connection, domain)
    assert email_record == "🍍@gmail.com"


@pytest.mark.asyncio
async def test_get_url_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    url_record = await get_url_record(connection, domain)
    assert url_record == "🍍.io"


@pytest.mark.asyncio
async def test_get_discord_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    discord_record = await get_discord_record(connection, domain)
    assert discord_record == "@🍍#7493"


@pytest.mark.asyncio
async def test_get_github_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    github_record = await get_github_record(connection, domain)
    assert github_record == "@🍍_dev"


@pytest.mark.asyncio
async def test_get_twitter_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    twitter_record = await get_twitter_record(connection, domain)
    assert twitter_record == "@🍍"


@pytest.mark.asyncio
async def test_get_telegram_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    telegram_record = await get_telegram_record(connection, domain)
    assert telegram_record == "@🍍-tg"


@pytest.mark.asyncio
async def test_get_reddit_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    reddit_record = await get_reddit_record(connection, domain)
    assert reddit_record == "@reddit-🍍"


@pytest.mark.asyncio
async def test_email_sub_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "test.🇺🇸.sol"
    email_record = await get_email_record(connection, domain)
    assert email_record == "test@test.com"


@pytest.mark.asyncio
async def test_get_multiple_records(connection_url):
    connection = AsyncClient(connection_url)
    domain = "🍍"
    res = await get_records(
        connection,
        domain,
        [
            Record.Telegram,
            Record.Github,
            Record.Backpack,
        ],
        True,
    )
    assert res[0] == "@🍍-tg"
    assert res[1] == "@🍍_dev"
    assert res[2] is None


@pytest.mark.asyncio
async def test_get_bsc_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "aanda.sol"
    res = await get_bsc_record(
        connection,
        domain,
    )
    assert res == "0x4170ad697176fe6d660763f6e4dfcf25018e8b63"


@pytest.mark.asyncio
async def test_create_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-3.sol"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix = await create_record_instruction(
        connection,
        domain,
        Record.A,
        "192.168.0.1",
        owner,
        owner,
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash
    tx = create_versioned_transaction(
        [ix],
        owner,
        blockhash,
    )
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None