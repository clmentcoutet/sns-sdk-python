from typing import List, Union, Optional

from borsh_construct import CStruct, U8
from solana.rpc.async_api import AsyncClient
from solders.account import Account
from solders.pubkey import Pubkey

from exception import AccountDoesNotExistException


Registry = Union["NameRegistryState", None]


class NameRegistryState:
    HEADER_LEN = 96

    SCHEMA = CStruct(
        "parent_name" / U8[32],
        "owner" / U8[32],
        "class_name" / U8[32],
    )

    def __init__(self, parent_name: bytes, owner: bytes, class_name: bytes):
        self.parent_name = Pubkey(parent_name)
        self.owner = Pubkey(owner)
        self.class_name = Pubkey(class_name)
        self.data: bytes = b""

    def __repr__(self):
        return f"NameRegistryState(parent_name={self.parent_name}, owner={self.owner}, class_name={self.class_name})"

    @classmethod
    def _parse_account_info(
        cls, name_account: Account | None
    ) -> Union["NameRegistryState", None]:
        """
        Parse a NameRegistryState object from a name account.
        :param name_account:
        :return:
        """
        if not name_account:
            return None
        parsed = cls.SCHEMA.parse(name_account.data)
        res = NameRegistryState(parsed.parent_name, parsed.owner, parsed.class_name)
        res.data = name_account.data[cls.HEADER_LEN :]
        return res

    @classmethod
    async def retrieve(
        cls, connection: AsyncClient, name_account_key: Pubkey
    ) -> Registry:
        """
        Retrieve a NameRegistryState object from a name account key.
        :param connection:
        :param name_account_key:
        :return:
        """
        name_account = await connection.get_account_info(
            name_account_key, encoding="base64"
        )
        if name_account is None or name_account.value is None:
            raise AccountDoesNotExistException(
                f"Account {name_account_key} does not exist"
            )

        return cls._parse_account_info(name_account.value)

    @classmethod
    async def _retrieve_batch(
        cls,
        connection: AsyncClient,
        name_account_keys: List[Pubkey],
    ) -> List[Registry]:
        """
        Retrieve multiple NameRegistryState objects from a list of name account keys.
        :param connection:
        :param name_account_keys:
        :return:
        """
        name_accounts = await connection.get_multiple_accounts(
            name_account_keys, encoding="base64"
        )
        return [
            cls._parse_account_info(name_account)
            for name_account in name_accounts.value
        ]

    @classmethod
    async def retrieve_batch(
        cls,
        connection: AsyncClient,
        name_account_keys: List[Pubkey],
        batch_size: Optional[int] = 100,
    ) -> List[Registry]:
        """
        Retrieve multiple NameRegistryState objects from a list of name account keys.
        use batch size of 100
        :param connection:
        :param name_account_keys:
        :param batch_size: batch size
        :return:
        """
        result: List[Registry] = []
        keys = name_account_keys.copy()
        while keys:
            result.extend(await cls._retrieve_batch(connection, keys[:batch_size]))
            keys = keys[batch_size:]
        return result
