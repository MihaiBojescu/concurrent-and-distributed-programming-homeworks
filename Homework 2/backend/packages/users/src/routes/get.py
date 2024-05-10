from ..utils.route import BaseRoute
from ..utils.service import BaseService
from ..utils.request import Request
from ..utils.response import Response


class GetRoute(BaseRoute):
    _service: BaseService

    def __init__(self, service: BaseService) -> None:
        self._service = service

    def call(self, request: Request):
        user_id = request.data.get("userId", "")

        response = self._service.call(user_id=user_id)

        return Response(
            status_code=200,
            action=request.action,
            request_id=request.request_id,
            data=response,
        )
