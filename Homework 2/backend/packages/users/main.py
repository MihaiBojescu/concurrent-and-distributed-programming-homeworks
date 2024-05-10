import os
from src.utils.clients import ClientsSingleton
from src.utils.logger import BaseLogger
from src.utils.router import Router
from src.routes.get import GetRoute
from src.routes.create import CreateRoute
from src.routes.login import LoginRoute
from src.services.get import GetService
from src.services.create import CreateService
from src.services.login import LoginService


def lambda_handler(event, context):
    redis_host = os.environ.get("REDIS_HOST")
    redis_port = int(os.environ.get("REDIS_PORT"))
    pg_host = os.environ.get("DATABASE_HOST")
    pg_port = os.environ.get("DATABASE_PORT")
    pg_db = os.environ.get("DATABASE_DATABASE")
    pg_user = os.environ.get("DATABASE_USERNAME")
    pg_password = os.environ.get("DATABASE_PASSWORD")

    clients = ClientsSingleton(
        redis_host=redis_host,
        redis_port=redis_port,
        pg_host=pg_host,
        pg_port=pg_port,
        pg_db=pg_db,
        pg_user=pg_user,
        pg_password=pg_password,
    )
    redis_client = clients.cache
    pg_conn = clients.database

    logger = BaseLogger()

    get_service = GetService(redis_client=redis_client, postgres_client=pg_conn)
    create_service = CreateService(redis_client=redis_client, postgres_client=pg_conn)
    login_service = LoginService(redis_client=redis_client, postgres_client=pg_conn)

    get_route = GetRoute(service=get_service)
    create_route = CreateRoute(service=create_service)
    login_route = LoginRoute(service=login_service)

    router = Router(logger=logger)
    router.register("users-get", handler=get_route)
    router.register("users-create", handler=create_route)
    router.register("users-login", handler=login_route)

    response = router.call(event)

    return response.to_lambda_response()
