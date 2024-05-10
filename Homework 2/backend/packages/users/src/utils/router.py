import json
import traceback
import typing as t
from .logger import BaseLogger
from .route import BaseRoute
from .request import Request
from .response import Response


class Router:
    _logger: BaseLogger
    _routes: t.Dict[str, BaseRoute]

    def __init__(self, logger: BaseLogger) -> None:
        self._logger = logger
        self._routes = {}

    def register(self, routeKey: str, handler: BaseRoute):
        self._routes[routeKey] = handler

    def call(self, event):
        request = Request(event=event)
        response = None

        self._logger.info(
            f"[Connection id {request.connection_id}{'' if request.request_id is None else f', request id {request.request_id} -> request'}] Route key: {request.route}, data: {json.dumps(request.data)}"
        )

        if request.route not in self._routes:
            response = Response(
                status_code=404,
                action=request.action,
                request_id=request.request_id,
                data={"reason": "Not found"},
            )
        else:
            try:
                response = self._routes[request.route].call(request)

            except Exception as e:
                self._logger.error(
                    f"[Connection id {request.connection_id}{'' if request.request_id is None else f', request id {request.request_id} !! error'}] Route key: {request.route}, error: {e}, traceback: {traceback.format_exc()}"
                )

                response = Response(
                    status_code=500,
                    action=request.action,
                    request_id=request.request_id,
                    data={"reason": "Internal server error"},
                )

        if not response:
            return

        self._logger.info(
            f"[Connection id {request.connection_id}{'' if request.request_id is None else f', request id {request.request_id} <- response'}] Route key: {request.route}, status code: {response.status_code}, data: {response.data}"
        )

        return response
