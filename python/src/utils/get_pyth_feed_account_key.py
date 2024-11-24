from typing import Tuple, List

from solders.pubkey import Pubkey

from constants import DEFAULT_PYTH_PUSH_PROGRAM


def get_pyth_feed_account_key(shard: int, price_feed: List[int]) -> Tuple[Pubkey, int]:
    buffer = bytearray(2)
    buffer[0:2] = shard.to_bytes(2, "little")
    return Pubkey.find_program_address(
        [bytes(buffer), bytes(price_feed)],
        DEFAULT_PYTH_PUSH_PROGRAM,
    )
