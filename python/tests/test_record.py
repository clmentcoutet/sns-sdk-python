import pytest
from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from NameRegistryState import NameRegistryState
from bindings import create_record_instruction
from custom_types import Record
from record import (
    get_arweave_record,
    get_bsc_record,
    get_btc_record,
    get_discord_record,
    get_doge_record,
    get_email_record,
    get_eth_record,
    get_github_record,
    get_ipfs_record,
    get_ltc_record,
    get_reddit_record,
    get_telegram_record,
    get_twitter_record,
    get_url_record,
    get_records,
    get_record_key,
    deserialize_record, serialize_record,
)
from resolve import resolve_sol_record_v1
from transactions import create_versioned_transaction


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


@pytest.mark.asyncio
async def test_check_sol_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-4"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    res = await resolve_sol_record_v1(connection, owner, domain)

    assert res == Pubkey.from_string("Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ")


@pytest.mark.asyncio
async def test_serialize_deserialize():
    items = [
        {"content": "this is a test", "record": Record.TXT},
        {
            "content": "inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9",
            "record": Record.Injective,
        },
        {"content": "example.com", "record": Record.CNAME},
        {"content": "example.com", "record": Record.CNAME},
        {"content": "0xc0ffee254729296a45a3885639ac7e10f9d54979", "record": Record.ETH},
        {"content": "1.1.1.4", "record": Record.A},
        {"content": "2345:425:2ca1::567:5673:23b5", "record": Record.AAAA},
        {"content": "username", "record": Record.Discord},
    ]

    for e in items:
        ser = serialize_record(e["content"], e["record"])
        registry = NameRegistryState(
            owner=bytes(Pubkey.default()),
            parent_name=bytes(Pubkey.default()),
            class_name=bytes(Pubkey.default()),
        )
        registry.data = ser
        des = deserialize_record(registry, e["record"], Pubkey.default())
        assert des == e["content"]


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "domain, record, expected",
    [
        ("domain1.sol", Record.SOL, "ATH9akc5pi1PWDB39YY7VCoYzCxmz8XVj23oegSoNSPL"),
        ("sub.domain2.sol", Record.SOL, "AEgJVf6zaQfkyYPnYu8Y9Vxa1Sy69EtRSP8iGubx5MnC"),
        ("domain3.sol", Record.Url, "EuxtWLCKsdpwM8ftKjnD2Q8vBdzZunh7DY1mHwXhLTqx"),
        ("sub.domain4.sol", Record.Url, "64nv6HSbifdUgdWst48V4YUB3Y3uQXVQRD4iDZPd9qGx"),
        ("domain5.sol", Record.IPFS, "2uRMeYzKXaYgFVQ1Yh7fKyZWcxsFUMgpEwMi19sVjwjk"),
        (
            "sub.domain6.sol",
            Record.IPFS,
            "61JdnEhbd2bEfxnu2uQ38gM2SUry2yY8kBMEseYh8dDy",
        ),
    ],
)
async def test_get_record_key(domain, record, expected):
    result = await get_record_key(domain, record)
    assert result == Pubkey.from_string(expected)
