from typing import TypedDict, Optional, List

from solana.rpc.async_api import AsyncClient
from typing_extensions import NotRequired

from custom_types import Record
from record_v2.deserialize_record_content_v2 import deserialize_record_content_v2
from record_v2.get_record_key_v2 import get_record_key_v2
from sns_records.state import Record as SnsRecord


class GetRecordV2Options(TypedDict):
    deserialize: Optional[bool]


class RecordResult(TypedDict):
    retrievedRecord: SnsRecord
    record: Record
    deserialized_content: NotRequired[str]


async def get_multiple_records_v2(
    connection: AsyncClient,
    domain: str,
    records: List[Record],
    options: GetRecordV2Options = None,
) -> List[RecordResult | None]:
    pubkeys = [get_record_key_v2(domain, record) for record in records]
    retrieved_records = await SnsRecord.retrieve_batch(connection, pubkeys)

    if options.get("deserialize", False):
        return [
            RecordResult(
                retrievedRecord=e,
                record=records[idx],
                deserialized_content=deserialize_record_content_v2(
                    e.get_content(),
                    records[idx],
                ),
            )
            if e
            else None
            for idx, e in enumerate(retrieved_records)
        ]

    return [
        RecordResult(
            retrievedRecord=e,
            record=records[idx],
        )
        if e
        else None
        for idx, e in enumerate(retrieved_records)
    ]
