from abc import ABC, abstractmethod
from typing import List

from borsh_construct import CStruct
from solders.pubkey import Pubkey
from solders.instruction import AccountMeta, Instruction

class BaseInstruction(ABC):
    def __init__(self, *, tag: int, **kwargs):
        self.tag = tag

    @abstractmethod
    def schema(self) -> CStruct:
        """
        Each subclass must define its specific schema.
        """
        pass

    def serialize(self) -> bytes:
        """
        Serialize the instruction data based on the schema.
        """
        return self.schema().build(self.__dict__)

    def create_instruction(
        self,
        *,
        program_id: Pubkey,
        accounts: List[AccountMeta],
    ) -> Instruction:
        data = self.serialize()
        return Instruction(program_id=program_id, accounts=accounts, data=data)

    @abstractmethod
    def get_instruction(self, **kwargs) -> Instruction:
        """
        Each subclass must define how to construct its specific keys.
        """
        pass
