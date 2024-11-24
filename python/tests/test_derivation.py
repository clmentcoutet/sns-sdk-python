from utils import get_domain_key

items = [
    {
        "domain": "bonfida",
        "address": "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
    },
    {
        "domain": "bonfida.sol",
        "address": "Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb",
    },
    {
        "domain": "dex.bonfida",
        "address": "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
    },
    {
        "domain": "dex.bonfida.sol",
        "address": "HoFfFXqFHAC8RP3duuQNzag1ieUwJRBv1HtRNiWFq4Qu",
    },
]


async def test_derivation():
    for item in items:
        pubkey = get_domain_key(item["domain"])["pubkey"]
        assert str(pubkey) == item["address"]
