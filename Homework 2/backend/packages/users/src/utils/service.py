import typing as t


T = t.TypeVar("T")


class BaseService:
    def call(self, params: ...) -> T:
        return {}
