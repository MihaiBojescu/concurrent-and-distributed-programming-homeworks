from time import time_ns
from socket import socket, AF_INET, SOCK_DGRAM
from data.message import MessageFragmenterFactory


class UdpClient:
    _socket: socket

    def __init__(self) -> None:
        self._socket = socket(family=AF_INET, type=SOCK_DGRAM)

    def run(self, to_address: str, to_port: int, data: str, data_copies: int) -> None:
        encoded_data = data.encode("utf-8")

        print(f"Sending to: {to_address}:{to_port}")

        try:
            self._socket.sendto(b"\x00", (to_address, to_port))
            max_size_raw, address = self._socket.recvfrom(8)
            max_size = int.from_bytes(max_size_raw)
            message_fragmenter = MessageFragmenterFactory(max_size).build(
                encoded_data
            )

            then = time_ns()

            for _ in range(data_copies + 1):
                for message in message_fragmenter:
                    self._socket.sendto(message.to_bytes(), (to_address, to_port))
                    data, address_prime = self._socket.recvfrom(1)

                    if address != address_prime:
                        raise RuntimeError("Received from somebody else")

                message_fragmenter.reset()

            self._socket.sendto(b"\x01", (to_address, to_port))

            now = time_ns()
            print(f"Transmission took {(now - then) / 1000000000}s")
        finally:
            self._socket.close()
