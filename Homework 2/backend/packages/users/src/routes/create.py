from ..utils.route import BaseRoute
from ..utils.service import BaseService
from ..utils.request import Request
from ..utils.response import Response


class CreateRoute(BaseRoute):
    _service: BaseService

    def __init__(self, service: BaseService) -> None:
        self._service = service

    def call(self, request: Request):
        email = request.data.get("email", "")
        name = request.data.get("name", "")
        password = request.data.get("password", "")

        response = self._service.call(email=email, name=name, password=password)

        return Response(
            status_code=200,
            action=request.action,
            request_id=request.request_id,
            data=response,
        )
