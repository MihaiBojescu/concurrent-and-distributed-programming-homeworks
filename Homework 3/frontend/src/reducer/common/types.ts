
export type WithIdentifier<T extends object> = T & { id: string }
export type WithTimestamp<T extends object> = T & { timestamp: string } 
export type ToTimeSeries<T extends object> = {
    [K in keyof T]: T[K] extends object ? ToTimeSeries<T[K]> : Array<T[K]>
}
