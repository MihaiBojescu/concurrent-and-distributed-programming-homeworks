import typing as t
import argparse
from dataclasses import dataclass


@dataclass
class Args:
    bind_address: str
    bind_port: int
    buffer_size: int
    variant: t.Union[t.Literal["TCP"], t.Literal["UDP"]]


class ArgsParser:
    def run(self) -> Args:
        parser = argparse.ArgumentParser()
        parser.add_argument(
            "--bind-address",
            type=str,
            help="Address to bind to",
            default="0.0.0.0",
            required=False,
        )
        parser.add_argument(
            "--bind-port",
            type=int,
            help="Port to bind to",
            default=3000,
            required=False,
        )
        parser.add_argument(
            "--buffer-size",
            type=int,
            help="Buffer size to use",
            default=65535,
            required=False,
        )
        parser.add_argument(
            "--variant",
            type=str,
            help="Use TCP or UDP?",
            default="TCP",
            required=False,
        )
        result = parser.parse_args()

        return Args(
            bind_address=result.bind_address,
            bind_port=result.bind_port,
            buffer_size=result.buffer_size,
            variant=result.variant,
        )
