import pytest
from solana.constants import SYSTEM_PROGRAM_ID
from solana.rpc.async_api import AsyncClient

from exception import (
    WrongValidationException,
    PdaOwnerNotAllowedException,
    InvalidRoAException,
)
from resolve.resolve import resolve


@pytest.mark.parametrize(
    "domain, result, config",
    [
        ("sns-ip-5-wallet-1", "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs", None),
        ("sns-ip-5-wallet-2", "AxwzQXhZNJb9zLyiHUQA12L2GL7CxvUNrp6neee6r3cA", None),
        ("sns-ip-5-wallet-4", "7PLHHJawDoa4PGJUK3mUnusV7SEVwZwEyV5csVzm86J4", None),
        (
            "sns-ip-5-wallet-5",
            "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            {"allow_pda": True, "program_ids": [SYSTEM_PROGRAM_ID]},
        ),
        (
            "sns-ip-5-wallet-5",
            "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            {"allow_pda": "any"},
        ),
        ("sns-ip-5-wallet-7", "53Ujp7go6CETvC7LTyxBuyopp5ivjKt6VSfixLm1pQrH", None),
        ("sns-ip-5-wallet-8", "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs", None),
        ("sns-ip-5-wallet-9", "ALd1XSrQMCPSRayYUoUZnp6KcP6gERfJhWzkP49CkXKs", None),
        (
            "sns-ip-5-wallet-10",
            "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            {"allow_pda": True, "program_ids": [SYSTEM_PROGRAM_ID]},
        ),
        (
            "sns-ip-5-wallet-10",
            "96GKJgm2W3P8Bae78brPrJf4Yi9AN1wtPJwg2XVQ2rMr",
            {"allow_pda": "any"},
        ),
    ],
)
@pytest.mark.asyncio
async def test_resolve_correctly(connection_url, domain, result, config):
    connection = AsyncClient(connection_url)
    resolved_value = await resolve(connection, domain, config)
    assert str(resolved_value) == result


@pytest.mark.parametrize(
    "domain, error",
    [
        ("sns-ip-5-wallet-3", WrongValidationException),
        ("sns-ip-5-wallet-6", PdaOwnerNotAllowedException),
        ("sns-ip-5-wallet-11", PdaOwnerNotAllowedException),
        ("sns-ip-5-wallet-12", WrongValidationException),
    ],
)
@pytest.mark.asyncio
async def test_resolve_throws_error(connection_url, domain, error):
    connection = AsyncClient(connection_url)
    with pytest.raises(error):
        await resolve(connection, domain)


@pytest.mark.parametrize(
    "domain, owner",
    [
        ("wallet-guide-5.sol", "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ("wallet-guide-4.sol", "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ("wallet-guide-3.sol", "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ("wallet-guide-2.sol", "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
        ("wallet-guide-1.sol", "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
        ("wallet-guide-0.sol", "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ("sub-0.wallet-guide-3.sol", "Fxuoy3gFjfJALhwkRcuKjRdechcgffUApeYAfMWck6w8"),
        ("sub-1.wallet-guide-3.sol", "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ("wallet-guide-6", "Hf4daCT4tC2Vy9RCe9q8avT68yAsNJ1dQe6xiQqyGuqZ"),
        ("wallet-guide-8", "36Dn3RWhB8x4c83W6ebQ2C2eH9sh5bQX2nMdkP2cWaA4"),
    ],
)
@pytest.mark.asyncio
async def test_resolve_correctly_backward_compatibility(connection_url, domain, owner):
    connection = AsyncClient(connection_url)
    resolved_value = await resolve(connection, domain)
    assert str(resolved_value) == owner
