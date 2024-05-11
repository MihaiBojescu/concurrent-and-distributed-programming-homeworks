export interface ICronClient {
    schedule(expression: string, callback: () => Promise<void>): void
    unschedule(expression: string, callback: () => Promise<void>): void
}

