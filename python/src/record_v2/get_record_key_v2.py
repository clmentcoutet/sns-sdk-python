from solders.pubkey import Pubkey

from custom_types import Record
from sns_records.constants import CENTRAL_STATE_SNS_RECORDS
from utils import get_domain_key, get_hashed_name, get_name_account_key


def get_record_key_v2(
    domain: str,
    record: Record,
) -> Pubkey:
    pubkey = get_domain_key(domain)["pubkey"]
    hashed = get_hashed_name(f"\x02{record.value}")
    return get_name_account_key(hashed, CENTRAL_STATE_SNS_RECORDS, pubkey)
