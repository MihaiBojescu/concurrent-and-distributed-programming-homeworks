import { ICacheClient } from "../drivers/base/cache"

export type Peer = {
    host: string
    port: number
}

type Params = {
    client: ICacheClient
}

type Self = {
    client: ICacheClient
}

export type PeersRepository = {
    get(): Promise<Peer[]>
    set(peers: Peer[]): Promise<void>
}

export const makePeersRepository = (params: Params): PeersRepository => {
    const self: Self = {
        client: params.client
    }

    return {
        get: get(self),
        set: set(self)
    }
}

const get = (self: Self): PeersRepository['get'] => async () => {
    return await self.client.get('peers') || []
}

const set = (self: Self): PeersRepository['set'] => async (peers) => {
    await self.client.set('peers', peers)
}
