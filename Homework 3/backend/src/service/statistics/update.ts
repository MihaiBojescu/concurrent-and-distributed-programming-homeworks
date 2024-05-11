import os from 'os'
import { StatisticsRepository } from "../../repository/statistics"
import { ILoggingClient } from '../../drivers/base/logging'

type Params = {
    logger: ILoggingClient
    repository: StatisticsRepository
}

type Self = {
    logger: ILoggingClient
    repository: StatisticsRepository
}

export interface UpdateStatisticsService {
    run(): Promise<void>
}

export const makeUpdateStatisticsService = (params: Params) => {
    const self: Self = {
        logger: params.logger,
        repository: params.repository
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): UpdateStatisticsService['run'] => async () => {
    const loadAverage = os.loadavg()
    const freeMem = os.freemem()
    const statistics = {
        loadAverage: {
            oneMin: loadAverage[0]!,
            fiveMin: loadAverage[1]!,
            fifteenMin: loadAverage[2]!
        },
        memory: {
            free: freeMem,
        }
    }

    await self.repository.updateStatistics(statistics)

    self.logger.debug('[Statistics update service] Updated statistics', statistics)
}
