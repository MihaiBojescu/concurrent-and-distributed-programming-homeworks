import os from 'os'
import { Peer, PeersRepository } from "../../repository/peers"
import { IDNSClient } from '../../drivers/base/dns'
import { ILoggingClient } from "../../drivers/base/logging"

type Params = {
    logger: ILoggingClient
    dnsClient: IDNSClient
    repository: PeersRepository
    self: Peer
    app: Peer
    excludedHosts: string[]
}

type Self = {
    logger: ILoggingClient
    dnsClient: IDNSClient
    repository: PeersRepository
    self: Peer
    app: Peer
    excludedHosts: string[]
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
        app: params.app,
        excludedHosts: params.excludedHosts,
    }

    return {
        run: run(self)
    }
}

const run = (self: Self): UpdatePeersService['run'] => async () => {
    try {
        const interfaces = os.networkInterfaces();
        const localAddresses = Object
            .keys(interfaces)
            .map(entry =>
                interfaces[entry]!.filter(iface => !iface.internal && iface.family === 'IPv4').map(iface => iface.address))
            .reduce((acc, interfaces) => acc.concat(interfaces))
    
        const peers = await self.dnsClient.resolve4('application.local')
        const trimmedPeers = peers.filter((clientA, indexA) =>
            !localAddresses.find(clientB => clientA === clientB) &&
            !peers.find((clientB, indexB) => indexA < indexB && clientA === clientB) &&
            clientA !== self.self.host &&
            clientA !== self.app.host &&
            !self.excludedHosts.find((clientB) => clientA === clientB)
        )
        const mappedPeers = trimmedPeers.map<Peer>(client => ({
            host: client,
            port: self.self.port
        }))
    
        await self.repository.set(mappedPeers)
    
        self.logger.debug('[Peers update service] Updated peers', { peers: trimmedPeers })
    } catch (error) {
        self.logger.error('[Peers update service] Failed updated peers', error)
    }
}
