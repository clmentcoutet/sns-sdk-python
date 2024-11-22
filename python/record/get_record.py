from typing import Optional

from solana.rpc.async_api import AsyncClient

from NameRegistryState import NameRegistryState
from exception import NoRecordDataException
from record.deserialize_record import deserialize_record
from record.get_record_key import get_record_key
from custom_types.record import Record, RECORD_V1_SIZE


async def get_record(
    connection: AsyncClient,
    domain: str,
    record: Record,
    deserialize: Optional[bool | None] = False,
) -> str | NameRegistryState | None:
    """
    Get a record from the NameRegistry program.
    :param connection: An AsyncClient connection to the Solana cluster.
    :param domain: The domain to get the record from.
    :param record: The record to get.
    :param deserialize: Whether or not to deserialize the record.
    :return: The record value, or None if the record does not exist.
    """
    pubkey = await get_record_key(domain, record)
    registry = await NameRegistryState.retrieve(connection, pubkey)

    if registry is None or registry.data is None:
        raise NoRecordDataException("The record does not exist.")

    if deserialize:
        return deserialize_record(registry, record, pubkey)

    record_size = RECORD_V1_SIZE.get(record)
    registry.data = registry.data[:record_size]

    return registry
