from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey


async def test_favorite_domain(connection_url):
    connection = AsyncClient(connection_url)
    items = [
        {
            "user": Pubkey.from_string("FidaeBkZkvDqi1GXNEwB8uWmj9Ngx2HXSS5nyGRuVFcZ"),
            "favorite": {
                "domain": Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
                "reverse": "bonfida",
                "stale": True,
            },
        },
        {
            "user": Pubkey.from_string("HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA"),
            "favorite": {
                "domain": Pubkey.from_string("Crf8hzfthWGbGbLTVCiqRqV5MVnbpHB1L9KQMd6gsinb"),
                "reverse": "bonfida",
                "stale": False,
            },
        },
        {
            "user": Pubkey.from_string("A41TAGFpQkFpJidLwH37ydunE7Q3jpBaS228RkoXiRQk"),
            "favorite": {
                "domain": Pubkey.from_string("BaQq8Uib3Aw5SPBedC8MdYCvpfEC9iLkUMHc5M74sAjv"),
                "reverse": "1.00728",
                "stale": False,
            },
        },
    ]

    for item in items:
        fav = await get_favorite_domain(connection, item["user"])

        assert fav["domain"] == item["favorite"]["domain"]
        assert fav["reverse"] == item["favorite"]["reverse"]
        assert fav["stale"] == item["favorite"]["stale"]