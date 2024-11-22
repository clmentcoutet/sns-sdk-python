from typing import Optional, List

from solana.rpc.async_api import AsyncClient

from NameRegistryState import NameRegistryState
from custom_types.record import Record
from record.deserialize_record import deserialize_record
from record.get_record_key import get_record_key


async def get_records(
    connection: AsyncClient,
    domain: str,
    records: List[Record],
    deserialize: Optional[bool | None] = False,
):
    pubkeys = [await get_record_key(domain, record) for record in records]
    registries = await NameRegistryState.retrieve_batch(connection, pubkeys)

    if deserialize:
        return [
            None
            if not e
            else deserialize_record(
                e, records[idx], await get_record_key(domain, records[idx])
            )
            for idx, e in enumerate(registries)
        ]
    return registries
