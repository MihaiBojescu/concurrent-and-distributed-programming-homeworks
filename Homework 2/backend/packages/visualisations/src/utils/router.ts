import { Logger } from "./logger"
import { makeRequest } from "./request"
import { Response, makeResponse } from "./response"
import { BaseRoute } from "./route"

export interface Router {
    register<Input, Output>(routeKey: string, handler: BaseRoute<Input, Output>): void
    call<Output>(event: any): Promise<Response<Output> | Response<undefined>>
}

type Self = {
    logger: Logger
    routes: Record<string, BaseRoute<any, any>>
}

export const makeRouter = (logger: Logger): Router => {
    const self: Self = {
        logger,
        routes: {}
    }

    return {
        register: register(self),
        call: call(self)
    }
}

const register = (self: Self): Router['register'] => (routeKey, handler) => {
    self.routes[routeKey] = handler
}

const call = (self: Self): Router['call'] => async (event) => {
    const request = makeRequest(event)
    let response: Response<any>

    self.logger.info(
        `[Connection id ${request.connectionId}${request.requestId === undefined ? '' : `, request id ${request.requestId} -> request`}] Route key: ${request.route}, data: ${JSON.stringify(request.data)}`
    )

    const routeHandler = self.routes[request.route]

    if (!routeHandler) {
        response = makeResponse(404, request.action, request.requestId, { "reason": "Not found" })
    } else {
        try {
            response = await routeHandler.call(request)
        } catch (error) {
            self.logger.error(
                `[Connection id ${request.connectionId}${request.requestId === undefined ? '' : `, request id ${request.requestId} !! error`}] Route key: ${request.route}, error: ${(error as Error).message}, traceback: ${(error as Error).stack}`
            )

            response = makeResponse(
                500,
                request.action,
                request.requestId,
                { reason: "Internal server error" }
            )
        }
    }

    if (response === undefined) {
        response = makeResponse(
            200,
            undefined,
            undefined,
            undefined
        )
    }

    self.logger.info(
        `[Connection id ${request.connectionId}${request.requestId === undefined ? '' : `, request id ${request.requestId} <- response`}] Route key: ${request.route}, status code: ${response.statusCode}, ${!('data' in response) ? '' : `data: ${JSON.stringify(response.data)}`}`
    )

    return response
}
