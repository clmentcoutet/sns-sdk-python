import grapheme


def get_domain_price_from_name(
    name: str,
) -> int:
    split = list(grapheme.graphemes(name))

    match len(split):
        case 1:
            return 750
        case 2:
            return 700
        case 3:
            return 640
        case 4:
            return 160
        case _:
            return 20
