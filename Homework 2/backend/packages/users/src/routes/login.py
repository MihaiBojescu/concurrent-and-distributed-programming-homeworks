from ..utils.route import BaseRoute
from ..utils.service import BaseService
from ..utils.request import Request
from ..utils.response import Response


class LoginRoute(BaseRoute):
    _service: BaseService

    def __init__(self, service: BaseService) -> None:
        self._service = service

    def call(self, request: Request):
        email = request.data.get("email", "")
        password = request.data.get("password", "")
        session = request.data.get("session", None)

        response = self._service.call(
            connection_id=request.connection_id,
            email=email,
            password=password,
            session=session,
        )

        return Response(
            status_code=200,
            action=request.action,
            request_id=request.request_id,
            data=response,
        )
