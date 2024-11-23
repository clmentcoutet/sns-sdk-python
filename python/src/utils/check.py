from typing import TypeVar

from exception import SNSException

T = TypeVar("T", bound=SNSException)


def check(condition: bool, error: T) -> None:
    """
    Checks a condition and raises an error if the condition is False.

    :param condition: The condition to check.
    :param error: The SNSException to raise if the condition is False.
    :raises: The provided error if the condition is False.
    """
    if not condition:
        raise error
