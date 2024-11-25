from borsh_construct import CStruct, U8, U32, String
from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey


class CreateWithNftInstruction:
    TAG: int = 17
    NAME: str = ""
    SPACE: int = 0
    SCHEMA = CStruct(
        "tag" / U8,
        "name" / String,
        "space" / U32,
    )

    def __init__(self, name: str, space: int):
        self.NAME = name
        self.SPACE = space

    @classmethod
    def serialize(cls) -> bytes:
        if cls.NAME is None or cls.SPACE is None:
            raise ValueError("Name and space must be set")
        return cls.SCHEMA.build(
            {
                "tag": cls.TAG,
                "name": cls.NAME,
                "space": cls.SPACE,
            }
        )

    @classmethod
    def get_instruction(
            cls,
            program_id: Pubkey,
            naming_service_program: Pubkey,
            root_domain: Pubkey,
            name: Pubkey,
            reverse_lookup: Pubkey,
            system_program: Pubkey,
            central_state: Pubkey,
            buyer: Pubkey,
            nft_source: Pubkey,
            nft_metadata: Pubkey,
            nft_mint: Pubkey,
            master_edition: Pubkey,
            collection: Pubkey,
            spl_token_program: Pubkey,
            rent_sysvar: Pubkey,
            state: Pubkey,
            mpl_token_metadata: Pubkey,
    ) -> Instruction:
        data = cls.serialize()
        accounts = [
            AccountMeta(
                pubkey=naming_service_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=root_domain,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=name,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=reverse_lookup,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=system_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=central_state,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=buyer,
                is_signer=True,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=nft_source,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=nft_metadata,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=nft_mint,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=master_edition,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=collection,
                is_signer=False,
                is_writable=True,
            ),
            AccountMeta(
                pubkey=spl_token_program,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=rent_sysvar,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=state,
                is_signer=False,
                is_writable=False,
            ),
            AccountMeta(
                pubkey=mpl_token_metadata,
                is_signer=False,
                is_writable=False,
            ),
        ]

        return Instruction(
            program_id=program_id,
            accounts=accounts,
            data=data,
        )