import redis
import hashlib
import psycopg2.extras
from psycopg2.extensions import connection
from ..utils.service import BaseService


class CreateService(BaseService):
    _redis_client: redis.Redis
    _postgres_client: connection

    def __init__(self, redis_client: redis.Redis, postgres_client: connection) -> None:
        self._redis_client = redis_client
        self._postgres_client = postgres_client

    def call(self, email: str, name: str, password: str):
        user = None
        password_hash = hashlib.sha512(password.encode("utf-8")).hexdigest()

        with self._postgres_client.cursor(
            cursor_factory=psycopg2.extras.RealDictCursor
        ) as cursor:
            cursor.execute(
                """
                INSERT INTO users (email, name, password)
                VALUES (%s, %s, %s)
                RETURNING *
                """,
                (email, name, password_hash),
            )
            self._postgres_client.commit()
            user = cursor.fetchone()
            del user["password"]

        return {"user": user}
