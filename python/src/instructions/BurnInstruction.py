from borsh_construct import CStruct, U8
from solders.instruction import AccountMeta, Instruction
from solders.pubkey import Pubkey


class BurnInstruction:
    TAG = 16
    SCHEMA = CStruct(
        "tag" / U8,
    )

    @classmethod
    def serialize(cls) -> bytes:
        return cls.SCHEMA.build(dict(tag=cls.TAG))

    @classmethod
    def get_instruction(
        cls,
        program_id: Pubkey,
        name_service_id: Pubkey,
        system_program: Pubkey,
        domain: Pubkey,
        reverse: Pubkey,
        reselling_state: Pubkey,
        state: Pubkey,
        central_state: Pubkey,
        owner: Pubkey,
        target: Pubkey,
    ) -> Instruction:
        data = cls.serialize()

        accounts = [
            AccountMeta(
                pubkey=name_service_id,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=system_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=domain,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=reverse,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=reselling_state,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=state,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=central_state,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=owner,
                is_signer=True,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=target,
                is_signer=False,
                is_writable=True,
            ),
        ]

        return Instruction(
            program_id=program_id,
            accounts=accounts,
            data=data,
        )
