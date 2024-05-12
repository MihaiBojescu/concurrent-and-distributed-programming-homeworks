export type Peer = {
    host: string
    port: number
}

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
