import { IHTTPServerController } from "../../drivers/base/httpServer";
import { ILoggingClient } from "../../drivers/base/logging";
import { Peer } from "../../repository/peers";
import { GetPeersService } from "../../service/peers/get";

type Params = {
    logger: ILoggingClient
    service: GetPeersService
}

type Self = {
    logger: ILoggingClient
    service: GetPeersService
}

export type GetPeersController = {
    run: IHTTPServerController<{}, {}, void, {}, Peer[]>
}

export const makeGetPeersController = (params: Params): GetPeersController => {
    const self: Self = {
        logger: params.logger,
        service: params.service
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetPeersController['run'] => async (req) => {
    self.logger.debug(`[Peers get controller] Received request from IP ${req.ip}`)

    const result = await self.service.run()

    return {
        statusCode: 200,
        headers: {},
        body: result
    }
}