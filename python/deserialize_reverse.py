from typing import Optional


def deserialize_reverse(
    data: Optional[bytes], trim_first_null_byte: bool = False
) -> str:
    """
    Deserialize reverse.
    :param data: The input data as bytes.
    :param trim_first_null_byte: Whether to trim the first null byte.
    :return: The deserialized string or None if data is not provided.
    """
    if data is None:
        return ""

    name_length = int.from_bytes(data[:4], "little")
    name = data[4 : 4 + name_length].decode("utf-8")
    if trim_first_null_byte:
        name = name.lstrip("\0")
    else:
        name = name.replace("\0", "\0", 1)
    return name
