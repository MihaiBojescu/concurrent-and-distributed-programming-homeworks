import { IHTTPClient, IHTTPClientResponse } from "../../drivers/base/httpClient"
import { IHTTPServerRequest } from "../../drivers/base/httpServer"
import { ILoggingClient } from "../../drivers/base/logging"
import { Peer, PeersRepository } from "../../repository/peers"
import { Statistics, StatisticsRepository } from "../../repository/statistics"

type Params = {
    logger: ILoggingClient
    statisticsRepository: StatisticsRepository
    peersRepository: PeersRepository
    client: IHTTPClient
    peersToAsk: number
    forwarder: Peer
    app: Peer
}

type Self = {
    logger: ILoggingClient
    statisticsRepository: StatisticsRepository
    peersRepository: PeersRepository
    client: IHTTPClient
    peersToAsk: number
    forwarder: Peer
    app: Peer

    pickBestPeer(): Promise<Peer>
}

export interface ApplicationForwardingService {
    run<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(req: IHTTPServerRequest<RequestHeaders, RequestQuery, RequestBody>): Promise<IHTTPClientResponse<ResponseHeaders, ResponseBody>>
}

export const makeApplicationForwardingService = (params: Params): ApplicationForwardingService => {
    const self: Self = {
        logger: params.logger,
        statisticsRepository: params.statisticsRepository,
        peersRepository: params.peersRepository,
        client: params.client,
        peersToAsk: params.peersToAsk,
        forwarder: params.forwarder,
        app: params.app
    } as Self
    self.pickBestPeer = pickBestPeer(self)

    return {
        run: run(self)
    }
}

const run = (self: Self): ApplicationForwardingService['run'] => async <RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(req: IHTTPServerRequest<RequestHeaders, RequestQuery, RequestBody>) => {
    const method = req.method.toLocaleLowerCase() as keyof IHTTPClient

    if ('X-Was-Triaged' in req.headers && req.headers['X-Was-Triaged'] === 'true') {
        self.logger.info(`[Application forward service] Request was triaged before, executing locally`)

        await self.statisticsRepository.incrementTasks()
        delete req.headers['X-Was-Triaged']
        const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${self.app.host}:${self.app.port}${req.path}`, req.headers, req.query, req.body)
        await self.statisticsRepository.decrementTasks()

        return response
    }


    const bestPeer = await self.pickBestPeer()

    self.logger.info(`[Application forward service] Best peer picked`, { peer: bestPeer })

    if (bestPeer === self.app) {
        self.logger.info(`[Application forward service] Best peer is self, executing locally`)

        await self.statisticsRepository.incrementTasks()
        delete req.headers['X-Was-Triaged']
        const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${bestPeer.host}:${bestPeer.port}${req.path}`, req.headers, req.query, req.body)
        await self.statisticsRepository.decrementTasks()

        return response
    }

    self.logger.info(`[Application forward service] Best peer is not self, executing remotely on peer`)

    const headers = { ...req.headers, 'X-Was-Triaged': 'true' }
    const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${bestPeer.host}:${self.forwarder.port}${req.path}`, headers, req.query, req.body)

    return response
}

const pickBestPeer = (self: Self): Self['pickBestPeer'] => async () => {
    const peers = await self.peersRepository.get()
    const pickedPeers: Peer[] = []
    const statistics = await self.statisticsRepository.get()
    let bestPeer = { peer: self.app, statistics }

    for (let i = 0; i < Math.min(self.peersToAsk, peers.length); i++) {
        let peer = pickedPeers[0] || peers[0]

        while (!peer || pickedPeers.includes(peer)) {
            peer = peers[Math.floor(Math.random() * peers.length)]
        }

        pickedPeers.push(peer)
    }

    const peerStatistics = await Promise.all(peers.map(async (peer) => {
        try {
            const response = await self.client.get<void, Statistics>(`http://${peer.host}:${peer.port}/api/statistics`, {}, {})
            return { peer, statistics: response.body }
        } catch {
            return { peer, statistics: null }
        }
    }))

    bestPeer = peerStatistics.reduce<{ peer: Peer; statistics: Statistics }>((acc, peer) => {
        if (!peer.statistics) {
            return acc
        }

        if (peer.statistics.tasksInQueue < acc.statistics.tasksInQueue || peer.statistics.loadAverage.oneMin < acc.statistics.loadAverage.oneMin) {
            return peer
        }

        return acc
    }, bestPeer)

    return bestPeer.peer
};
