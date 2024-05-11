import { ILoggingClient } from "../../drivers/base/logging"
import { Statistics, StatisticsRepository } from "../../repository/statistics"

type Params = {
    logger: ILoggingClient
    repository: StatisticsRepository
}

type Self = {
    logger: ILoggingClient
    repository: StatisticsRepository
}

export interface GetStatisticsService {
    run(): Promise<Statistics | null>
}

export const makeGetStatisticsService = (params: Params) => {
    const self: Self = {
        logger: params.logger,
        repository: params.repository
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetStatisticsService['run'] => async () => {
    const statistics = await self.repository.get()

    self.logger.debug('[Statistics get service] Got statistics', statistics)

    return statistics
}
