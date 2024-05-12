import { ILinkedList } from "../../utils/linkedList"

export type Peer = {
    host: string
    port: number
}

export type WithIdentifier<T extends object> = T & { id: string }

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

export type WithTimestamp<T extends object> = T & { timestamp: number } 
export type ToTimeSeries<T extends object> = {
    [K in keyof T]: T[K] extends object ? ToTimeSeries<T[K]> : ILinkedList<T[K]>
}
