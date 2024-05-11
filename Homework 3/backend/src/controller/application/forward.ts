import { IHTTPClientResponse } from "../../drivers/base/httpClient";
import { IHTTPServerController } from "../../drivers/base/httpServer";
import { ApplicationForwardingService } from "../../service/application/forward";

type Params = {
    service: ApplicationForwardingService
}

type Self = {
    service: ApplicationForwardingService
}

export type ApplicationForwardingController = {
    run: IHTTPServerController<any, any, void, IHTTPClientResponse<any, any>['headers'], IHTTPClientResponse<any, any>['body']>
}

export const makeApplicationForwardingController = (params: Params): ApplicationForwardingController => {
    const self: Self = {
        service: params.service
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): ApplicationForwardingController['run'] => async (req) => {
    const result = await self.service.run(req)

    return {
        statusCode: result.statusCode,
        headers: result.headers,
        body: result.body
    }
}