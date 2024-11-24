from solders.pubkey import Pubkey

from nft.constants import NAME_TOKENIZER_ID, MINT_PREFIX


def get_domain_mint(
        domain: Pubkey
) -> Pubkey:
    """
    Retrieve the mint of a domain.
    :param domain:
    :return: mint of the domain
    """
    res, _ = Pubkey.find_program_address(
        [MINT_PREFIX, bytes(domain)],
        NAME_TOKENIZER_ID,
    )
    return res