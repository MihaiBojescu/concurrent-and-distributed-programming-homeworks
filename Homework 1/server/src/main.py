#!/usr/bin/env python3
from service.args import ArgsParser
from service.tcp import TcpServer
from service.udp import UdpServer


def main():
    args_parser = ArgsParser()
    args = args_parser.run()

    server = (
        TcpServer(buffer_size=args.buffer_size)
        if args.variant == "TCP"
        else UdpServer(buffer_size=args.buffer_size)
    )
    server.run(
        bind_address=args.bind_address,
        bind_port=args.bind_port,
    )


if __name__ == "__main__":
    main()
