from typing import Optional, TypedDict

from solders.pubkey import Pubkey
from typing_extensions import NotRequired

from constants import ROOT_DOMAIN_ACCOUNT, CENTRAL_STATE_SNS_RECORDS
from exception import InvalidInputError
from get_hashed_name_sync import get_hashed_name_sync
from get_name_account_key_sync import get_name_account_key
from record import RecordVersion


class DeriveResult(TypedDict):
    pubkey: Pubkey
    hashed: bytes


class Result(DeriveResult):
    is_sub: bool
    parent: Optional[Pubkey]
    is_sub_record: NotRequired[bool]


def _derive(
    name: str,
    parent: Pubkey = ROOT_DOMAIN_ACCOUNT,
    class_key: Optional[Pubkey] = None,
) -> DeriveResult:
    hashed = get_hashed_name_sync(name)
    pubkey = get_name_account_key(hashed, class_key, parent)
    return {
        "pubkey": pubkey,
        "hashed": hashed,
    }


def get_domain_key(domain: str, record: Optional[RecordVersion] = None) -> Result:
    if domain.endswith(".sol"):
        domain = domain[:-4]
    record_class = CENTRAL_STATE_SNS_RECORDS if record == RecordVersion.V2 else None
    splitted = domain.split(".")
    if len(splitted) == 2:
        prefix = bytes([record.value]) if record else b"\x00"
        sub = prefix.decode() + splitted[0]
        parent_key = _derive(splitted[1])["pubkey"]
        res = _derive(sub, parent_key, record_class)
        return {
            **res,
            "is_sub": True,
            "parent": parent_key,
        }
    elif len(splitted) == 3 and record:
        parent_key = _derive(splitted[2])["pubkey"]
        sub_key = _derive(splitted[1], parent_key)["pubkey"]
        record_prefix = b"\x02" if record == RecordVersion.V2 else b"\x01"
        res = _derive(str(record_prefix) + splitted[0], sub_key, record_class)
        return {
            **res,
            "is_sub": True,
            "parent": parent_key,
            "is_sub_record": True,
        }
    elif len(splitted) > 3:
        raise InvalidInputError("Invalid domain")
    res = _derive(domain, ROOT_DOMAIN_ACCOUNT)
    return {
        **res,
        "is_sub": False,
        "parent": None,
    }
