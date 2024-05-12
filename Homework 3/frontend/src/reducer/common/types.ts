import { ILinkedList } from "../../utils/linkedList"

export type WithIdentifier<T extends object> = T & { id: string }
export type WithTimestamp<T extends object> = T & { timestamp: number } 
export type ToTimeSeries<T extends object> = {
    [K in keyof T]: T[K] extends object ? ToTimeSeries<T[K]> : ILinkedList<T[K]>
}
