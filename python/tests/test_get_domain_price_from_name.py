import pytest

from utils import get_domain_price_from_name


@pytest.mark.parametrize("value, expected", [
    ("1", 750),
    ("✅", 750),
    ("요", 750),
    ("👩‍👩‍👧", 750),

    ("10", 700),
    ("1✅", 700),
    ("👩‍👩‍👧✅", 700),
    ("독도", 700),

    ("100", 640),
    ("10✅", 640),
    ("1독도", 640),

    ("1000", 160),
    ("100✅", 160),

    ("10000", 20),
    ("1000✅", 20),
    ("fêtes", 20),
])
def test_get_domain_price_from_name(value, expected):
    assert get_domain_price_from_name(value) == expected