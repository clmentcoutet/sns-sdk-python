from enum import Enum

from .NetworkSetter import NetworkSetter

class Network(Enum):
    Devnet = "devnet"
    Mainnet = "mainnet"


# Initialize with no constants set
ROOT_DOMAIN_ACCOUNT = None
NAME_PROGRAM_ID = None

# Function to change the constants set
def set_network(set_name: Network):
    NetworkSetter.set_network(set_name)
