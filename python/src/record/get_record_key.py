from typing import Optional

from solders.pubkey import Pubkey

from custom_types.record import Record, RecordVersion
from utils.get_domain_key import get_domain_key


async def get_record_key(
    domain: str,
    record: Record,
    record_version: Optional[RecordVersion] = RecordVersion.V1,
) -> Pubkey:
    """
    Get the key for a record in the NameRegistry program.
    :param domain: The domain to get the record key for.
    :param record: The record to get the key for.
    :param record_version: The record version to get the key for.
    :return: The record key.
    """
    res = get_domain_key(f"{record.value}.{domain}", record_version)
    return res["pubkey"]  # type: ignore[no-any-return]
