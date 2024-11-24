import pytest
from solana.rpc.async_api import AsyncClient
from solders.keypair import Keypair
from solders.pubkey import Pubkey

from bindings import create_record_instruction_v2
from bindings.delete_record_instruction_v2 import delete_record_instruction_v2
from bindings.eth_validate_record_instruction_v2 import (
    eth_validate_record_instruction_v2,
)
from bindings.update_record_instruction_v2 import update_record_instruction_v2
from bindings.validate_record_instruction_v2 import validate_record_instruction_v2
from bindings.write_roa_record_instruction_v2 import write_roa_record_instruction_v2
from custom_types import Record
from record_v2.deserialize_record_content_v2 import deserialize_record_content_v2
from record_v2.get_multiple_records_v2 import get_multiple_records_v2
from record_v2.get_record_key_v2 import get_record_key_v2
from record_v2.get_record_v2 import get_record_v2
from record_v2.serialize_record_content_v2 import serialize_record_content_v2
from transactions import create_versioned_transaction


@pytest.mark.parametrize(
    "content, record, expected_length",
    [
        ("this is a test", Record.TXT, None),
        (str(Keypair().pubkey()), Record.SOL, 32),
        ("inj13glcnaum2xqv5a0n0hdsmv0f6nfacjsfvrh5j9", Record.Injective, 20),
        ("example.com", Record.CNAME, None),
        ("example.com", Record.CNAME, None),
        ("0xc0ffee254729296a45a3885639ac7e10f9d54979", Record.ETH, 20),
        ("1.1.1.4", Record.A, 4),
        ("2345:425:2ca1::567:5673:23b5", Record.AAAA, 16),
        ("username", Record.Discord, None),
        (
            "k51qzi5uqu5dlvj2baxnqndepeb86cbk3ng7n3i46uzyxzyqj2xjonzllnv0v8",
            Record.IPNS,
            None,
        ),
    ],
)
def test_records_des_ser_v2(content, record, expected_length):
    ser = serialize_record_content_v2(content, record)
    des = deserialize_record_content_v2(ser, record)

    # Check if deserialized content matches original
    assert (
        des == content
    ), f"Deserialized content {des} does not match original {content}"

    # If expected length is provided, validate serialized content length
    if expected_length is not None:
        assert (
            len(ser) == expected_length
        ), f"Serialized length {len(ser)} does not match expected {expected_length}"


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def create_record_v2(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")
    ix = create_record_instruction_v2(domain, Record.Github, "bonfida", owner, owner)
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def update_record_v2(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(domain, Record.Github, "bonfida", owner, owner)
    ix_2 = update_record_instruction_v2(
        domain, Record.Github, "some text", owner, owner
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1, ix_2], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def delete_record_v2(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(domain, Record.Github, "bonfida", owner, owner)
    ix_2 = delete_record_instruction_v2(domain, Record.Github, owner, owner)
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1, ix_2], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_solana_verify(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(domain, Record.Github, "bonfida", owner, owner)
    ix_2 = validate_record_instruction_v2(
        True, domain, Record.Github, owner, owner, owner
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1, ix_2], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


async def test_eth_verify(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(
        domain, Record.ETH, "0x4bfbfd1e018f9f27eeb788160579daf7e2cd7da7", owner, owner
    )
    ix_2 = eth_validate_record_instruction_v2(
        domain,
        Record.ETH,
        owner,
        owner,
        bytes(
            [
                78,
                235,
                200,
                2,
                51,
                5,
                225,
                127,
                83,
                156,
                25,
                226,
                53,
                239,
                196,
                189,
                196,
                197,
                121,
                2,
                91,
                2,
                99,
                11,
                31,
                179,
                5,
                233,
                52,
                246,
                137,
                252,
                72,
                27,
                67,
                15,
                86,
                42,
                62,
                117,
                140,
                223,
                159,
                142,
                86,
                227,
                233,
                185,
                149,
                111,
                92,
                122,
                147,
                23,
                217,
                1,
                66,
                72,
                63,
                150,
                27,
                219,
                152,
                10,
                28,
            ]
        ),
        bytes(
            [
                75,
                251,
                253,
                30,
                1,
                143,
                159,
                39,
                238,
                183,
                136,
                22,
                5,
                121,
                218,
                247,
                226,
                205,
                125,
                167,
            ]
        ),
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1, ix_2], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_roa_record(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(
        domain, Record.Github, "bonfida", owner, owner
    )
    ix_2 = write_roa_record_instruction_v2(
        domain,
        Record.ETH,
        owner,
        owner,
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1, ix_2], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_create_record_for_sub(connection_url):
    connection = AsyncClient(connection_url)
    domain = "sub-0.wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_1 = create_record_instruction_v2(
        domain, Record.Github, "bonfida", owner, owner
    )
    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_1], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_create_record_for_sub_update_verify_staleness_delete(connection_url):
    connection = AsyncClient(connection_url)
    domain = "sub-0.wallet-guide-9"
    owner = Pubkey.from_string("Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8")

    ix_create = create_record_instruction_v2(
        domain, Record.Github, "bonfida", owner, owner
    )

    ix_update = update_record_instruction_v2(
        domain, Record.Github, "somethingelse", owner, owner
    )

    ix_verify = validate_record_instruction_v2(
        True, domain, Record.Github, owner, owner, owner
    )

    ix_delete = delete_record_instruction_v2(
        domain, Record.Github, owner, owner
    )

    blockhash = (await connection.get_latest_blockhash()).value.blockhash

    tx = create_versioned_transaction([ix_create, ix_update, ix_verify, ix_delete], owner, blockhash)
    res = await connection.simulate_transaction(tx)
    assert res.value.err is None


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_get_record_v2(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9.sol"
    items = [
        {"record": Record.IPFS, "value": "ipfs://test"},
        {"record": Record.Email, "value": "test@gmail.com"},
        {"record": Record.Url, "value": "https://google.com"},
    ]

    for item in items:
        res = await get_record_v2(connection, domain, item["record"], {"deserialize": True})
        assert res["deserialized_content"] == item["value"]


@pytest.mark.skip(reason="This test is not implemented")
@pytest.mark.asyncio
async def test_get_multiple_records_v2(connection_url):
    connection = AsyncClient(connection_url)
    domain = "wallet-guide-9.sol"
    items = [
        {"record": Record.IPFS, "value": "ipfs://test"},
        {"record": Record.Email, "value": "test@gmail.com"},
        {"record": Record.Url, "value": "https://google.com"},
    ]

    # Call the equivalent of getMultipleRecordsV2
    res = await get_multiple_records_v2(
        connection,
        domain,
        [item["record"] for item in items],
        {"deserialize": True}
    )

    # Check each item in the response
    for i in range(len(items)):
        assert items[i]["value"] == res[i].get("deserialized_content")
        assert items[i]["record"] == res[i].get("record")


@pytest.mark.parametrize("domain, record, expected", [
    ("domain1.sol", Record.SOL, "GBrd6Q53eu1T2PiaQAtm92r3DwxmoGvZ2D6xjtVtN1Qt"),
    ("sub.domain2.sol", Record.SOL, "A3EFmyCmK5rp73TdgLH8aW49PJ8SJw915arhydRZ6Sws"),
    ("domain3.sol", Record.Url, "DMZmnjcAnUwSje4o2LGJhipCfNZ5b37GEbbkwbQBWEW1"),
    ("sub.domain4.sol", Record.Url, "6o8JQ7vss6r9sw9GWNVugZktwfEJ67iUz6H63hhmg4sj"),
    ("domain5.sol", Record.IPFS, "DQHeVmAj9Nz4uAn2dneEsgBZWcfhUqLdtbDcfWhGL47D"),
    ("sub.domain6.sol", Record.IPFS, "Dj7tnTTaktrrmdtatRuLG3YdtGZk8XEBMb4w5WtCBHvr"),
])
def test_get_record_v2_key(domain, record, expected):
    result = get_record_key_v2(domain, record)
    assert str(result) == expected