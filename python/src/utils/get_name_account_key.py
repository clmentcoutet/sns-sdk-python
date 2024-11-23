from typing import Optional

from solders.pubkey import Pubkey

from constants import NAME_PROGRAM_ID


def get_name_account_key(
    hashed_name: bytes,
    name_class: Optional[Pubkey] = None,
    name_parent: Optional[Pubkey] = None,
) -> Pubkey:
    """
    Get the name account key synchronously.
    :param hashed_name:
    :param name_class:
    :param name_parent:
    :return: the name account key
    """

    seeds = [hashed_name]
    # Add name_class or a 32-byte zero buffer
    if name_class:
        seeds.append(bytes(name_class))
    else:
        seeds.append(bytes(32))

    # Add name_parent or a 32-byte zero buffer
    if name_parent:
        seeds.append(bytes(name_parent))
    else:
        seeds.append(bytes(32))
    res = Pubkey.find_program_address(seeds, NAME_PROGRAM_ID)
    return res[0]
