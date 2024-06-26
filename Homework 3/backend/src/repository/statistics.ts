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

const defaultStatistics: Statistics = {
    tasksInQueue: 0,
    loadAverage: {
        oneMin: 0,
        fiveMin: 0,
        fifteenMin: 0,
    },
    memory: {
        free: 0
    }
}

export type StatisticsRepository = {
    get(): Promise<Statistics>
    set(statistics: Statistics): Promise<void>
    incrementTasks(): Promise<void>
    decrementTasks(): Promise<void>
    updateStatistics(statistics: Omit<Statistics, 'tasksInQueue'>): Promise<void>
}

export const makeStatisticsRepository = (params: Params): StatisticsRepository => {
    const self: Self = {
        client: params.client
    }

    return {
        get: get(self),
        set: set(self),
        incrementTasks: incrementTasks(self),
        decrementTasks: decrementTasks(self),
        updateStatistics: updateStatistics(self),
    }
}

const get = (self: Self): StatisticsRepository['get'] => async () => {
    return await self.client.get('statistics') || defaultStatistics
}

const set = (self: Self): StatisticsRepository['set'] => async (statistics) => {
    return self.client.set('statistics', statistics)
}

const incrementTasks = (self: Self): StatisticsRepository['incrementTasks'] => async () => {
    const statistics = await self.client.get<Statistics>('statistics') || defaultStatistics
    statistics.tasksInQueue = statistics.tasksInQueue < 0 ? 1 : statistics.tasksInQueue + 1
    await self.client.set('statistics', statistics)
}

const decrementTasks = (self: Self): StatisticsRepository['decrementTasks'] => async () => {
    const statistics = await self.client.get<Statistics>('statistics') || defaultStatistics
    statistics.tasksInQueue = statistics.tasksInQueue < 0 ? 0 : statistics.tasksInQueue - 1
    await self.client.set('statistics', statistics)
}

const updateStatistics = (self: Self): StatisticsRepository['updateStatistics'] => async (statistics) => {
    const oldStatistics = await self.client.get<Statistics>('statistics') || defaultStatistics
    await self.client.set('statistics', { ...oldStatistics, ...statistics })
}
