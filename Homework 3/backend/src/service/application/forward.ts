import { IHTTPClient, IHTTPClientResponse } from "../../drivers/base/httpClient"
import { IHTTPServerRequest } from "../../drivers/base/httpServer"
import { Peer, PeersRepository } from "../../repository/peers"
import { Statistics, StatisticsRepository } from "../../repository/statistics"

type Params = {
    statisticsRepository: StatisticsRepository
    peersRepository: PeersRepository
    client: IHTTPClient
    peersToAsk: number
    app: Peer
}

type Self = {
    statisticsRepository: StatisticsRepository
    peersRepository: PeersRepository
    client: IHTTPClient
    peersToAsk: number
    app: Peer

    pickBestPeer(): Promise<Peer>
}

export interface ApplicationForwardingService {
    run<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(req: IHTTPServerRequest<RequestHeaders, RequestQuery, RequestBody>): Promise<IHTTPClientResponse<ResponseHeaders, ResponseBody>>
}

export const makeApplicationForwardingService = (params: Params): ApplicationForwardingService => {
    const self: Self = {
        statisticsRepository: params.statisticsRepository,
        peersRepository: params.peersRepository,
        client: params.client,
        peersToAsk: params.peersToAsk,
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
        await self.statisticsRepository.incrementTasks()
        delete req.headers['X-Was-Triaged']
        const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${self.app.host}:${self.app.port}${req.path}`, req.headers, req.query, req.body)
        await self.statisticsRepository.decrementTasks()

        return response
    }


    const bestPeer = await self.pickBestPeer()

    if (bestPeer === self.app) {
        await self.statisticsRepository.incrementTasks()
        delete req.headers['X-Was-Triaged']
        const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${bestPeer.host}:${bestPeer.port}${req.path}`, req.headers, req.query, req.body)
        await self.statisticsRepository.decrementTasks()

        return response
    }

    const headers = { ...req.headers, 'X-Was-Triaged': 'true' }
    const response = await self.client[method]<ResponseHeaders, ResponseBody>(`http://${bestPeer.host}:${bestPeer.port}${req.path}`, headers, req.query, req.body)

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
            const response = await self.client.get<void, Statistics>(`http://${peer.host}:${peer.port}/statistics`, {}, {})
            return { peer, statistics: response.body }
        } catch {
            return { peer, statistics: null }
        }
    }))

    bestPeer = peerStatistics.reduce<{ peer: Peer; statistics: Statistics }>((acc, peer) => {
        if (!peer.statistics) {
            return acc
        }

        if (peer.statistics.tasksInQueue < acc.statistics.tasksInQueue) {
            return peer
        }

        return acc
    }, bestPeer)

    return bestPeer.peer
};