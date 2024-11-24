from borsh_construct import CStruct, U64, U8

ACCOUNT_LAYOUT = CStruct(
    "mint" / U8[32],
    "owner" / U8[32],
    "amount" / U64,
    "delegate_option" / U8,
    "delegate" / U8[32],
    "state" / U8,
    "is_native_option" / U8,
    "is_native_raw" / U64,
    "delegated_amount_option" / U8,
    "delegated_amount" / U64,
)
