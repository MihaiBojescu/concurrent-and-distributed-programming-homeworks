import json
import typing as t
from dataclasses import dataclass

T = t.TypeVar("T")


@dataclass
class Response(t.Generic[T]):
    status_code: int
    action: t.Optional[str]
    request_id: t.Optional[int]
    data: t.Optional[T]

    def to_lambda_response(self) -> dict:
        result = {
            "statusCode": self.status_code,
        }

        if (
            self.action is not None
            or self.request_id is not None
            or self.data is not None
        ):
            result["body"] = json.dumps(
                {
                    "requestId": self.request_id,
                    "action": self.action,
                    "data": self.data,
                },
                separators=(",", ":"),
            )

        return result

    def __repr__(self) -> str:
        return json.dumps(
            {
                "statusCode": self.status_code,
                "body": {
                    "action": self.action,
                    "requestId": self.request_id,
                    "data": json.dumps(self.data),
                },
            },
            separators=(",", ":"),
        )
