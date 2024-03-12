import typing as t
from time import time_ns
from socket import socket, AF_INET, SOCK_DGRAM, error
from data.message import Message, MessageDefragmenter, MessageType


class UdpServer:
    _buffer_size: int
    _socket: socket

    def __init__(self, buffer_size: int) -> None:
        if buffer_size < 1 or buffer_size > 65535:
            raise RuntimeError(f"Buffer size not in limits: 1 < {buffer_size} < 65536")

        self._buffer_size = buffer_size
        self._socket = socket(family=AF_INET, type=SOCK_DGRAM)

    def run(self, bind_address: str, bind_port: int) -> None:
        self._socket.bind((bind_address, bind_port))
        message_defragmenter = MessageDefragmenter(self._buffer_size)

        print(f"Listening on address: {bind_address}:{bind_port}")

        while True:
            starting_byte, client_address = self._socket.recvfrom(1)

            if starting_byte != b"\x00":
                continue

            then = time_ns()
            received = 0
            messages: t.List[Message] = []

            print(f"Client address: {client_address}")

            try:
                self._socket.sendto(self._buffer_size.to_bytes(8), client_address)

                while True:
                    data_raw, client_address_prime = self._socket.recvfrom(
                        self._buffer_size
                    )

                    if client_address != client_address_prime:
                        continue

                    self._socket.sendto(b"\x00", client_address)

                    if data_raw == b"\x01":
                        messages = []
                        break

                    message = Message.from_bytes(data_raw)

                    if message.message_type != MessageType.END.value:
                        messages.append(message)
                        received += len(message.data)
                        print(f"Total received {received:10} bytes: {message.data}")
                        continue

                    all_data = message_defragmenter.build(messages)
                    messages = []
                    print(f"Client {client_address} said {all_data}")

            except error as e:
                print(e)

            now = time_ns()
            print(f"Transmission took {(now - then) / 1000000000}s")
