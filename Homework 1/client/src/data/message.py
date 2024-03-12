import typing as t
from enum import Enum


class MessageType(Enum):
    DATA = 0
    END = 1


class Message:
    _message_sequence_number: int
    _message_type: int
    _data: bytearray

    def __init__(self, message_sequence_number: int, message_type: int, data: bytes):
        self._message_sequence_number = message_sequence_number
        self._message_type = message_type
        self._data = data

    @staticmethod
    def from_bytes(data: bytes):
        message_sequence_number = int.from_bytes(data[0:8])
        message_type = int.from_bytes(data[8:9])
        data = bytearray(data[9:])

        return Message(message_sequence_number, message_type, data)

    def to_bytes(self) -> bytes:
        return bytes(
            [
                *self._message_sequence_number.to_bytes(8),
                *self._message_type.to_bytes(1),
                *self._data,
            ]
        )

    @property
    def message_sequence_number(self) -> int:
        return self._message_sequence_number

    @property
    def message_type(self) -> int:
        return self._message_type

    @property
    def data(self) -> bytes:
        return bytes(self._data)

    def __str__(self) -> str:
        return f"Message(seq={self._message_sequence_number}, data={self._data})"


class MessageFragmenter:
    _max_size: int
    _message_sequence_number: int
    _message_sequency_byte: int
    _message_end_sent: bool
    _data: bytes

    def __init__(self, max_size: int, data: bytes):
        self._max_size = max_size
        self._message_sequence_number = 0
        self._message_sequency_byte = 0
        self._message_end_sent = False
        self._data = data

    def reset(self):
        self._message_sequence_number = 0
        self._message_sequency_byte = 0
        self._message_end_sent = False

    def __iter__(self):
        return self

    def __next__(self) -> Message:
        old_message_sequence_byte = self._message_sequency_byte
        old_message_sequence_number = self._message_sequence_number
        self._message_sequency_byte += self._max_size - 9
        self._message_sequence_number += 1

        if len(self._data) < old_message_sequence_byte:
            if self._message_end_sent:
                raise StopIteration

            self._message_end_sent = True
            return Message(
                old_message_sequence_number, MessageType.END.value, bytearray()
            )

        data = bytearray(
            self._data[old_message_sequence_byte : self._message_sequency_byte]
        )
        message = Message(old_message_sequence_number, MessageType.DATA.value, data)

        return message


class MessageFragmenterFactory:
    _max_size: int

    def __init__(self, max_size: int):
        self._max_size = max_size

    def build(self, data: bytes) -> MessageFragmenter:
        return MessageFragmenter(self._max_size, data)


class MessageDefragmenter:
    _max_size: int

    def __init__(self, max_size: int):
        self._max_size = max_size

    def build(self, messages: t.List[Message]) -> bytes:
        messages.sort(key=lambda entry: entry.message_sequence_number)
        result = bytearray()

        for i in range(len(messages) - 1):
            if (
                messages[i].message_sequence_number + 1
                != messages[i + 1].message_sequence_number
            ):
                raise RuntimeError(
                    f"Lost 1 message along the way: {messages[i].message_sequence_number + 1}"
                )

            result += messages[i].data

        result += messages[-1].data
        return bytes(result)
