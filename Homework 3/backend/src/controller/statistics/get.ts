import { IHTTPServerController } from "../../drivers/base/httpServer";
import { ILoggingClient } from "../../drivers/base/logging";
import { Statistics } from "../../repository/statistics";
import { GetStatisticsService } from "../../service/statistics/get";

type Params = {
    logger: ILoggingClient
    service: GetStatisticsService
}

type Self = {
    logger: ILoggingClient
    service: GetStatisticsService
}

export type GetStatisticsController = {
    run: IHTTPServerController<{}, {}, void, {}, Statistics | null>
}

export const makeGetStatisticsController = (params: Params): GetStatisticsController => {
    const self: Self = {
        logger: params.logger,
        service: params.service
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetStatisticsController['run'] => async (req) => {
    self.logger.debug(`[Statistics get controller] Received request from IP ${req.ip}`)

    const result = await self.service.run()

    return {
        statusCode: !result ? 204 : 200,
        headers: {},
        body: result
    }
}