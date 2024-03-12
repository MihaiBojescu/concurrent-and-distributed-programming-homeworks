from time import time_ns
from socket import socket, AF_INET, SOCK_STREAM, error


class TcpServer:
    _buffer_size: int
    _socket: socket

    def __init__(self, buffer_size: int) -> None:
        if buffer_size < 1 or buffer_size > 65535:
            raise RuntimeError(f"Buffer size not in limits: 1 < {buffer_size} < 65536")

        self._buffer_size = buffer_size
        self._socket = socket(family=AF_INET, type=SOCK_STREAM)

    def run(self, bind_address: str, bind_port: int) -> None:
        self._socket.bind((bind_address, bind_port))
        self._socket.listen(1)

        print(f"Listening on address: {bind_address}:{bind_port}")

        while True:
            connection, client_address = self._socket.accept()
            received = 0

            print(f"Client address: {client_address}")
            then = time_ns()

            try:
                while True:
                    data_raw = connection.recv(self._buffer_size)

                    if not data_raw:
                        break

                    data = data_raw.decode("utf-8")
                    received += len(data_raw)
                    print(f"Total received {received:10} bytes: {data}")
            except error as e:
                print(e)
            finally:
                connection.close()

            now = time_ns()
            print(f"Transmission took {(now - then) / 1000000000}s")
