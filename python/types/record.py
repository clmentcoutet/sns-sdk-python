from enum import Enum


class Record(Enum):
    IPFS = "IPFS"
    ARWV = "ARWV"
    SOL = "SOL"
    ETH = "ETH"
    BTC = "BTC"
    LTC = "LTC"
    DOGE = "DOGE"
    Email = "email"
    Url = "url"
    Discord = "discord"
    Github = "github"
    Reddit = "reddit"
    Twitter = "twitter"
    Telegram = "telegram"
    Pic = "pic"
    SHDW = "SHDW"
    POINT = "POINT"
    BSC = "BSC"
    Injective = "INJ"
    Backpack = "backpack"
    A = "A"
    AAAA = "AAAA"
    CNAME = "CNAME"
    TXT = "TXT"
    Background = "background"
    BASE = "BASE"
    IPNS = "IPNS"


class RecordVersion(Enum):
    V1 = 1
    V2 = 2


RECORD_V1_SIZE = {
    Record.SOL: 96,
    Record.ETH: 20,
    Record.BSC: 20,
    Record.Injective: 20,
    Record.A: 4,
    Record.AAAA: 16,
    Record.Background: 32,
}