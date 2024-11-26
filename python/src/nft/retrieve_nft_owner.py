from solana.rpc.async_api import AsyncClient
from solders.pubkey import Pubkey
from solders.rpc.errors import InvalidParamsMessage

from exception import SolanaJSONRPCException
from nft.AccountLayout import ACCOUNT_LAYOUT
from nft.get_domain_mint import get_domain_mint


async def retrieve_nft_owner(
    connection: AsyncClient, name_account: Pubkey
) -> Pubkey | None:
    """
    Retrieve the owner of an NFT.
    :param connection:
    :param name_account: the account of the NFT
    :return: human-readable name of the owner
    """
    try:
        mint = get_domain_mint(name_account)

        largest_accounts = await connection.get_token_largest_accounts(mint)
        if isinstance(largest_accounts, InvalidParamsMessage):  # type: ignore[unreachable]
            return None  # type: ignore[unreachable]
        if not largest_accounts or len(largest_accounts.value) == 0:
            return None

        largest_account_info = await connection.get_account_info(
            largest_accounts.value[0].address
        )
        if not largest_account_info or not largest_account_info.value:
            return None

        decoded = ACCOUNT_LAYOUT.parse(largest_account_info.value.data)
        if decoded.amount == 1:
            return Pubkey(decoded.owner)
        return None
    except SolanaJSONRPCException as err:
        if err.code == -32602:
            # Mint does not exist
            return None
        raise err
    except Exception as err:
        raise err
