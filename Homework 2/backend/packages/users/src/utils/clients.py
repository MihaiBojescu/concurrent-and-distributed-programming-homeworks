from typing import Any
import psycopg2
import psycopg2.extras
import redis


class Singleton(type):
    _instances = {}

    def __call__(self, *args: Any, **kwargs: Any) -> Any:
        if self not in self._instances:
            self._instances[self] = super().__call__(*args, **kwargs)

        return self._instances[self]


class Clients:
    def __init__(
        self,
        redis_host: str,
        redis_port: str,
        pg_host: str,
        pg_port: str,
        pg_db: str,
        pg_user: str,
        pg_password: str,
    ) -> None:
        self._redis_client = redis.Redis(host=redis_host, port=redis_port)
        self._pg_conn = psycopg2.connect(
            host=pg_host,
            port=pg_port,
            database=pg_db,
            user=pg_user,
            password=pg_password,
        )

    @property
    def cache(self):
        return self._redis_client

    @property
    def database(self):
        return self._pg_conn


class ClientsSingleton(Clients, metaclass=Singleton):
    pass
