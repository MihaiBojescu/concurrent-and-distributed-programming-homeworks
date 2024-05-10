export interface ICacheClient {
    get<T>(key: string): Promise<T | null>
    set<T>(key: string, value: T): Promise<void>
    expire(key: string, ttl: number): Promise<void>
    clear(): Promise<void>
}
