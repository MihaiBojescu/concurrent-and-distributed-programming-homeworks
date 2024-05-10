import json
import typing as t


T = t.TypeVar("T")


class Request(t.Generic[T]):
    _event: dict
    _route: str
    _connection_id: str
    _action: str
    _request_id: str
    _data: T

    def __init__(self, event: dict):
        request_context = event.get("requestContext", {})
        body = json.loads(event.get("body", ""))

        self._event = event
        self._route = request_context.get("routeKey", "")
        self._connection_id = request_context.get("connectionId", "")
        self._action = body.get("action", "")
        self._request_id = body.get("requestId", "")
        self._data = body.get("data", None)

    @property
    def event(self):
        return self._event

    @property
    def route(self):
        return self._route

    @property
    def connection_id(self):
        return self._connection_id

    @property
    def action(self):
        return self._action

    @property
    def request_id(self):
        return self._request_id

    @property
    def data(self):
        return self._data

    def __repr__(self) -> str:
        return json.dumps(
            {
                "routeKey": self._route,
                "data": {
                    "action": self._route,
                    "requestId": self._request_id,
                    "data": self._data,
                },
            }
        )
