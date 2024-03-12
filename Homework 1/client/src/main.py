#!/usr/bin/env python3
from service.args import ArgsParser
from service.tcp import TcpClient
from service.udp import UdpClient


def main():
    args_parser = ArgsParser()
    args = args_parser.run()

    client = TcpClient() if args.variant == "TCP" else UdpClient()
    client.run(
        to_address=args.to_address,
        to_port=args.to_port,
        data=args.data,
        data_resends=args.data_resends,
    )


if __name__ == "__main__":
    main()
