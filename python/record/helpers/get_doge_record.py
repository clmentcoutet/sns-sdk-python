from solana.rpc.async_api import AsyncClient

from record.get_record import get_record
from custom_types.record import Record


def get_doge_record(connection: AsyncClient, domain: str):
    """
    This function can be used to retrieve the Doge record of a domain name
    :param connection: The Solana RPC connection object
    :param domain: The .sol domain name
    :returns:
    """
    return get_record(connection, domain, Record.DOGE, True)