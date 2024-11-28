import importlib

from constants import Network


class NetworkSetter:
    _current_constants_module = importlib.import_module(f"constants.{Network.Mainnet.value}")

    @classmethod
    def set_network(cls, set_name: Network):
        """
        Set the current constants set to be used throughout the project.
        """
        try:
            module_name = f"constants.{set_name.value}"
            cls._current_constants_module = importlib.import_module(module_name)
        except ModuleNotFoundError:
            raise ValueError(f"Constants set '{set_name.value}' not found.")

    @classmethod
    def _update_interface(cls):
        """
        Update the constants in the interface (`constants/__init__.py`) to reflect the current set.
        """
        if cls._current_constants_module is None:
            raise RuntimeError("No constants set selected.")

        interface_globals = globals()
        for constant_name in dir(cls._current_constants_module):
            if constant_name.isupper():  # Only include constants (typically uppercase)
                interface_globals[constant_name] = getattr(cls._current_constants_module, constant_name)
