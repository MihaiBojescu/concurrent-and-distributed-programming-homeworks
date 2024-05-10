import { IHTTPServerController } from "../../drivers/base/httpServer";
import { Statistics } from "../../repository/statistics";
import { GetStatisticsService } from "../../service/statistics/get";

type Params = {
    service: GetStatisticsService
}

type Self = {
    service: GetStatisticsService
}

export type GetStatisticsController = {
    run: IHTTPServerController<{}, {}, void, {}, Statistics | null>
}

export const makeGetStatisticsController = (params: Params): GetStatisticsController => {
    const self: Self = {
        service: params.service
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetStatisticsController['run'] => async (_req) => {
    const result = await self.service.run()

    return {
        statusCode: !result ? 204 : 200,
        headers: {},
        body: result
    }
}