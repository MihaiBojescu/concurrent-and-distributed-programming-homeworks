import argparse
from dataclasses import dataclass


@dataclass
class Args:
    to_address: str
    to_port: int
    data: str
    data_resends: int


class ArgsParser:
    def run(self) -> Args:
        parser = argparse.ArgumentParser()
        parser.add_argument(
            "--to-address",
            type=str,
            help="Address to send data to",
            default="127.0.0.1",
            required=False,
        )
        parser.add_argument(
            "--to-port",
            type=int,
            help="Port to send data to",
            default=3000,
            required=False,
        )
        parser.add_argument(
            "--data",
            type=str,
            help="Data to send",
            default="Hello world!",
            required=False,
        )
        parser.add_argument(
            "--data-resends",
            type=int,
            help="Times to resend the data",
            default=0,
            required=False,
        )
        result = parser.parse_args()

        return Args(
            to_address=result.to_address,
            to_port=result.to_port,
            data=result.data,
            data_resends=result.data_resends,
        )
