from solana.rpc.async_api import AsyncClient
from typing_extensions import TypedDict, NotRequired

from custom_types import Record
from record_v2.deserialize_record_content_v2 import deserialize_record_content_v2
from record_v2.get_record_key_v2 import get_record_key_v2
from sns_records.state import Record as SnsRecord


class GetRecordV2Options(TypedDict):
    deserialize: NotRequired[bool]


class RecordResult(TypedDict):
    retrieved_record: SnsRecord
    record: Record
    deserialized_content: NotRequired[str]


class SingleRecordResult(TypedDict):
    retrieved_record: SnsRecord
    deserialized_content: NotRequired[str]


async def get_record_v2(
    connection: AsyncClient,
    domain: str,
    record: Record,
    options: GetRecordV2Options = None,
) -> SingleRecordResult:
    """
    Retrieve a record from the Solana network.
    """
    pubkey = get_record_key_v2(domain, record)
    retrieved_record = await SnsRecord.retrieve(connection, pubkey)

    if options.get("deserialize", False):
        return SingleRecordResult(
            retrieved_record=retrieved_record,
            deserialized_content=deserialize_record_content_v2(
                retrieved_record.get_content(),
                record,
            ),
        )
    return SingleRecordResult(retrieved_record=retrieved_record)
