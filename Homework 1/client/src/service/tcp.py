from socket import socket, AF_INET, SOCK_STREAM


class TcpClient:
    _socket: socket

    def __init__(self) -> None:
        self._socket = socket(family=AF_INET, type=SOCK_STREAM)

    def run(self, to_address: str, to_port: int, data: str, data_resends: int) -> None:
        self._socket.connect((to_address, to_port))
        encoded_data = data.encode("utf-8")

        print(f"Sending to: {to_address}:{to_port}")

        try:
            for _ in range(data_resends + 1):
                self._socket.send(encoded_data)
        finally:
            self._socket.close()
