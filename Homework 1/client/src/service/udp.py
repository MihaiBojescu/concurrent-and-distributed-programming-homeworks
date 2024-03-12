from socket import socket, AF_INET, SOCK_DGRAM
from time import sleep
from data.message import MessageFragmenterFactory


class UdpClient:
    _socket: socket

    def __init__(self) -> None:
        self._socket = socket(family=AF_INET, type=SOCK_DGRAM)

    def run(self, to_address: str, to_port: int, data: str, data_resends: int) -> None:
        encoded_data = data.encode("utf-8")

        print(f"Sending to: {to_address}:{to_port}")

        try:
            self._socket.sendto(b"\x00", (to_address, to_port))
            max_size_raw, _address = self._socket.recvfrom(8)
            max_size = int.from_bytes(max_size_raw)
            message_fragmenter = MessageFragmenterFactory(max_size).build(
                encoded_data
            )

            for _ in range(data_resends + 1):
                for message in message_fragmenter:
                    self._socket.sendto(message.to_bytes(), (to_address, to_port))

                message_fragmenter.reset()

            self._socket.sendto(b"\x01", (to_address, to_port))
        finally:
            self._socket.close()
