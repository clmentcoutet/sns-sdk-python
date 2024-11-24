from typing import TypedDict

from solders.pubkey import Pubkey

from custom_types import Record, RecordVersion
from exception import InvalidParentException
from utils import get_domain_key


class GetBaseInstructionDataResp(TypedDict):
    pubkey: Pubkey
    parent: Pubkey
    is_sub: bool


def get_base_instruction_data_v2(
    domain: str,
    record: Record,
) -> GetBaseInstructionDataResp:
    res = get_domain_key(
        f"{record.value}.{domain}",
        RecordVersion.V2,
    )
    pubkey = res["pubkey"]
    parent = res["parent"]
    is_sub = res["is_sub"]

    if is_sub:
        parent = get_domain_key(domain)["pubkey"]

    if not parent:
        raise InvalidParentException("Parent could not be found")

    return GetBaseInstructionDataResp(
        pubkey=pubkey,
        parent=parent,
        is_sub=is_sub,
    )
