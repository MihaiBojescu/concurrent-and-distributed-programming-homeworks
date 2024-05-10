from .request import Request
from .response import Response


class BaseRoute:
    def call(self, request: Request):
        return Response(
            status_code=200,
            action=request.action,
            request_id=request.request_id,
            data={},
        )
