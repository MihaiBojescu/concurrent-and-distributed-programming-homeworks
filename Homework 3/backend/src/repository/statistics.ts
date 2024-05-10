import { ICacheClient } from "../drivers/base/cache"

export type Statistics = {
    tasksInQueue: number
    loadAverage: {
        oneMin: number
        fiveMin: number
        fifteenMin: number
    }
    memory: {
        free: number
    }
}

type Params = {
    client: ICacheClient
}

type Self = {
    client: ICacheClient
}

export type StatisticsRepository = {
    get(): Promise<Statistics | null>
    set(statistics: Statistics): Promise<void>
}

export const makeStatisticsRepository = (params: Params): StatisticsRepository => {
    const self: Self = {
        client: params.client
    }

    return {
        get: get(self),
        set: set(self)
    }
}

const get = (self: Self): StatisticsRepository['get'] => async () => {
    return self.client.get('statistics')
}

const set = (self: Self): StatisticsRepository['set'] => async (statistics) => {
    return self.client.set('statistics', statistics)
}