import { IHTTPClientResponse } from "../../drivers/base/httpClient";
import { IHTTPServerController } from "../../drivers/base/httpServer";
import { ILoggingClient } from "../../drivers/base/logging";
import { ApplicationForwardingService } from "../../service/application/forward";

type Params = {
    logger: ILoggingClient
    service: ApplicationForwardingService
}

type Self = {
    logger: ILoggingClient
    service: ApplicationForwardingService
}

export type ApplicationForwardingController = {
    run: IHTTPServerController<any, any, void, IHTTPClientResponse<any, any>['headers'], IHTTPClientResponse<any, any>['body']>
}

export const makeApplicationForwardingController = (params: Params): ApplicationForwardingController => {
    const self: Self = {
        logger: params.logger,
        service: params.service
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): ApplicationForwardingController['run'] => async (req) => {
    self.logger.info(`[Application forward controller] Received request from IP ${req.ip}`)

    const result = await self.service.run(req)

    return {
        statusCode: result.statusCode,
        headers: result.headers,
        body: result.body
    }
}