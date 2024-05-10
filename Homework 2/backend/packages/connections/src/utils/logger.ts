export interface Logger {
    debug(...params: any): void
    info(...params: any): void
    warn(...params: any): void
    error(...params: any): void
}

export const makeLogger = () => {
    return {
        debug: debug(),
        info: info(),
        warn: warn(),
        error: error(),
    }
}

const debug = () => (...params: any[]) => {
    console.debug(...params)
}

const info = () => (...params: any[]) => {
    console.info(...params)
}

const warn = () => (...params: any[]) => {
    console.warn(...params)
}

const error = () => (...params: any[]) => {
    console.error(...params)
}
