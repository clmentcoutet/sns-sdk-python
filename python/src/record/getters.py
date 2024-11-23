from typing import Callable, Literal, Coroutine, Any

from solana.rpc.async_api import AsyncClient

from NameRegistryState import NameRegistryState
from custom_types.record import Record
from record.get_record import get_record


def create_record_getter(
    record_type: Record, *, deserialize: Literal[True, False] = True
) -> Callable[[AsyncClient, str], Coroutine[Any, Any, str | NameRegistryState | None]]:
    """
    Factory function to create record getters
    """

    async def get_specific_record(
        connection: AsyncClient, domain: str
    ) -> str | NameRegistryState | None:
        """
        Generic record getter function
        :param connection: The Solana RPC connection object
        :param domain: The .sol domain name
        :returns: Record
        """
        return await get_record(connection, domain, record_type, deserialize)

    get_specific_record.__name__ = f"get_{record_type.value.lower()}_record"
    get_specific_record.__doc__ = f"""
    This function can be used to retrieve the {record_type} record of a domain name
    :param connection: The Solana RPC connection object
    :param domain: The .sol domain name
    :returns: Record
    """

    return get_specific_record


# Create all record getters
get_arweave_record = create_record_getter(Record.ARWV)
get_background_record = create_record_getter(Record.Background)
get_backpack_record = create_record_getter(
    Record.Backpack,
)
get_bsc_record = create_record_getter(Record.BSC)
get_btc_record = create_record_getter(Record.BTC)
get_discord_record = create_record_getter(Record.Discord)
get_doge_record = create_record_getter(Record.DOGE)
get_email_record = create_record_getter(Record.Email)
get_eth_record = create_record_getter(Record.ETH)
get_github_record = create_record_getter(Record.Github)
get_injective_record = create_record_getter(Record.Injective)
get_ipfs_record = create_record_getter(Record.IPFS)
get_ltc_record = create_record_getter(Record.LTC)
get_pic_record = create_record_getter(Record.Pic)
get_point_record = create_record_getter(Record.POINT)
get_reddit_record = create_record_getter(Record.Reddit)
get_shdw_record = create_record_getter(Record.SHDW)
get_sol_record = create_record_getter(Record.SOL, deserialize=False)
get_telegram_record = create_record_getter(Record.Telegram)
get_twitter_record = create_record_getter(Record.Twitter)
get_url_record = create_record_getter(Record.Url)
