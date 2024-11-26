from solders.pubkey import Pubkey

SNS_RECORDS_ID: Pubkey = Pubkey.from_string(
    "HP3D4D1ZCmohQGFVms2SS4LCANgJyksBf5s1F77FuFjZ"
)

CENTRAL_STATE_SNS_RECORDS, _ = Pubkey.find_program_address(
    [bytes(SNS_RECORDS_ID)], SNS_RECORDS_ID
)

NAME_REGISTRY_LEN = 96