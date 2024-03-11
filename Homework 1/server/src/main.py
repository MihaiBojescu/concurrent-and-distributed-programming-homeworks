#!/usr/bin/env python3
from service.args import ArgsParser
from service.tcp import TcpServer


def main():
    args_parser = ArgsParser()
    args = args_parser.run()

    client = TcpServer(buffer_size=args.buffer_size)
    client.run(
        bind_address=args.bind_address,
        bind_port=args.bind_port,
    )


if __name__ == "__main__":
    main()
