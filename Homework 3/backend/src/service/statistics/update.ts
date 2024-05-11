import os from 'os'
import { StatisticsRepository } from "../../repository/statistics"

type Params = {
    repository: StatisticsRepository
}

type Self = {
    repository: StatisticsRepository
}

export interface UpdateStatisticsService {
    run(): Promise<void>
}

export const makeUpdateStatisticsService = (params: Params) => {
    const self: Self = {
        repository: params.repository
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): UpdateStatisticsService['run'] => async () => {
    const loadAverage = os.loadavg()
    const freeMem = os.freemem()

    await self.repository.updateStatistics({
        loadAverage: {
            oneMin: loadAverage[0]!,
            fiveMin: loadAverage[1]!,
            fifteenMin: loadAverage[2]!
        },
        memory: {
            free: freeMem,
        }
    })

    console.log('Updated statistics')
}
