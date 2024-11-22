from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey

from constants import ROOT_DOMAIN_ACCOUNT


async def retrieve_nft_owner(connection: AsyncClient, owner: Pubkey) -> Pubkey:
    """
    Retrieve the owner of an NFT.
    :param connection:
    :param owner:
    :return: human-readable name of the owner
    """
    # TODO: Implement this function
    return ROOT_DOMAIN_ACCOUNT
