from typing import List, Optional

from solders.hash import Hash
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.message import Message
from solders.null_signer import NullSigner
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction

from exception import UnsupportedSignatureException
from utils.check import check


def create_versioned_transaction(
    instructions: List[Instruction],
    payer: Pubkey,
    blockhash: Hash,
    signers: Optional[List[Keypair]] = None,
) -> VersionedTransaction:
    """
    Create a new transaction object. If you do not provide signers,
    a new random set of keypair will be created, useful to simulate a transaction.
    :param instructions:
    :param payer:
    :param blockhash:
    :param signers:
    :return:
    """
    message = Message.new_with_blockhash(
        instructions=instructions,
        payer=payer,
        blockhash=blockhash,
    )

    # create empty keypair for the transaction
    # this is useful for simulate_transaction or
    # other operations that does not require a signature yet
    num_required_signatures = message.header.num_required_signatures
    if signers is None:
        signers = [NullSigner(payer)] * num_required_signatures

    check(
        len(signers) == num_required_signatures,
        UnsupportedSignatureException(
            f"Number of signers ({len(signers)}) does not match number of required signatures ({num_required_signatures})"
        ),
    )

    return VersionedTransaction(
        message=message,
        keypairs=signers,
    )
