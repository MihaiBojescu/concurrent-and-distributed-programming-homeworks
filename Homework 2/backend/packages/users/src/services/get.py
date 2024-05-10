import redis
import psycopg2.extras
from psycopg2.extensions import connection
from ..utils.service import BaseService


class GetService(BaseService):
    _redis_client: redis.Redis
    _postgres_client: connection

    def __init__(self, redis_client: redis.Redis, postgres_client: connection) -> None:
        self._redis_client = redis_client
        self._postgres_client = postgres_client

    def call(self, user_id: str):
        user = None

        with self._postgres_client.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor
        ) as cursor:
            cursor.execute(
                """
                SELECT u.user_id, u.email, u.name
                FROM users u
                WHERE u.user_id = %s
                """,
                (user_id,),
            )
            user = cursor.fetchone()

        if user is None:
            return {"reason": "Not found"}

        return {"user": user}
