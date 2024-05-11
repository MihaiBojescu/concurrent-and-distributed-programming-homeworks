import { PeersRepository } from "../../repository/peers"
import { IDNSClient } from '../../drivers/base/dns'

type Params = {
    dnsClient: IDNSClient
    repository: PeersRepository
    port: number
}

type Self = {
    dnsClient: IDNSClient
    repository: PeersRepository
    port: number
}

export interface UpdatePeersService {
    run(): Promise<void>
}

export const makeUpdatePeersService = (params: Params) => {
    const self: Self = {
        dnsClient: params.dnsClient,
        repository: params.repository,
        port: params.port
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): UpdatePeersService['run'] => async () => {
    const clients = await self.dnsClient.resolve4('application.local')
    const oldClients = await self.repository.get()
    const difference = oldClients.filter((entryA) => !clients.find((entryB) => entryA.host === entryB))

    for (const client of clients) {
        await self.repository.add({
            host: client,
            port: self.port,
        })
    }

    for (const client of difference) {
        await self.repository.remove(client)
    }

    console.log('Updated peers')
}
