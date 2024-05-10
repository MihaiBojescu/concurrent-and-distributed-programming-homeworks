import { Statistics, StatisticsRepository } from "../../repository/statistics"

type Params = {
    repository: StatisticsRepository
}

type Self = {
    repository: StatisticsRepository
}

export interface GetStatisticsService {
    run(): Promise<Statistics | null>
}

export const makeGetStatisticsService = (params: Params) => {
    const self: Self = {
        repository: params.repository
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetStatisticsService['run'] => async () => {
    return self.repository.get()
}
