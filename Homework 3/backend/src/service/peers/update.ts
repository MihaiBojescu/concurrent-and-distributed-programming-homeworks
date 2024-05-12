import os from 'os'
import { Peer, PeersRepository } from "../../repository/peers"
import { IDNSClient } from '../../drivers/base/dns'
import { ILoggingClient } from "../../drivers/base/logging"

type Params = {
    logger: ILoggingClient
    dnsClient: IDNSClient
    repository: PeersRepository
    self: Peer
}

type Self = {
    logger: ILoggingClient
    dnsClient: IDNSClient
    repository: PeersRepository
    self: Peer
}

export interface UpdatePeersService {
    run(): Promise<void>
}

export const makeUpdatePeersService = (params: Params) => {
    const self: Self = {
        logger: params.logger,
        dnsClient: params.dnsClient,
        repository: params.repository,
        self: params.self,
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): UpdatePeersService['run'] => async () => {
    const interfaces = os.networkInterfaces();
    const localAddresses = Object
        .keys(interfaces)
        .map(entry =>
            interfaces[entry]!.filter(iface => !iface.internal && iface.family === 'IPv4').map(iface => iface.address))
        .reduce((acc, interfaces) => acc.concat(interfaces))

    const clients = await self.dnsClient.resolve4('application.local')
    const trimmedClients = clients.filter((clientA, indexA) =>
        !localAddresses.find(clientB => clientA === clientB) &&
        !clients.find((clientB, indexB) => indexA < indexB && clientA === clientB)
    )
    const mappedClients = trimmedClients.map<Peer>(client => ({
        host: client,
        port: self.self.port
    }))

    await self.repository.set(mappedClients)

    self.logger.debug('[Peers update service] Updated peers', { peers: trimmedClients })
}
