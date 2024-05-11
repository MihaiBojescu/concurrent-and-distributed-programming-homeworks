import { Peer, PeersRepository } from "../../repository/peers"
import { ILoggingClient } from "../../drivers/base/logging"

type Params = {
    logger: ILoggingClient
    repository: PeersRepository
}

type Self = {
    logger: ILoggingClient
    repository: PeersRepository
}

export interface GetPeersService {
    run(): Promise<Peer[]>
}

export const makeGetPeersService = (params: Params) => {
    const self: Self = {
        logger: params.logger,
        repository: params.repository
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): GetPeersService['run'] => async () => {
    self.logger.debug('[Peers get service] Peers were requested')

    return self.repository.get()
}
