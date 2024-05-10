import winston from 'winston'
import { ILoggingClient } from '../base/logging'

type Self = {
    client: winston.Logger
}

export const makeAxiosClient = (): ILoggingClient => {
    const self: Self = {
        client: winston.createLogger({
            format: winston.format.combine(
                winston.format.errors(),
                winston.format.prettyPrint()
            ),
            transports: [new winston.transports.Console()]
        })
    }

    return {
        debug: debug(self),
        info: info(self),
        warning: warning(self),
        error: error(self),
    }
}

const debug = (self: Self): ILoggingClient['debug'] => async (message, data) => {
    self.client.debug(message, data)
}

const info = (self: Self): ILoggingClient['info'] => async (message, data) => {
    self.client.info(message, data)
}

const warning = (self: Self): ILoggingClient['warning'] => async (message, data) => {
    self.client.warning(message, data)
}

const error = (self: Self): ILoggingClient['error'] => async (message, data) => {
    self.client.error(message, data)
}
