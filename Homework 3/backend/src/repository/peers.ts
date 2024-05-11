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
    add(peer: Peer): Promise<void>
    remove(peer: Peer): Promise<void>
}

export const makePeersRepository = (params: Params): PeersRepository => {
    const self: Self = {
        client: params.client
    }

    return {
        get: get(self),
        add: add(self),
        remove: remove(self)
    }
}

const get = (self: Self): PeersRepository['get'] => async () => {
    return await self.client.get('peers') || []
}

const add = (self: Self): PeersRepository['add'] => async (peer) => {
    const peers = await self.client.get<Peer[]>('peers')

    if (!peers) {
        await self.client.set('peers', [peer])
        return
    }

    if (peers.includes(peer)) {
        return
    }

    peers.push(peer)
    await self.client.set('peers', peers)
}

const remove = (self: Self): PeersRepository['remove'] => async (peer) => {
    const peers = await self.client.get<Peer[]>('peers')

    if (!peers) {
        return
    }

    const index = peers.indexOf(peer)

    if (index === -1) {
        return
    }

    peers.splice(index, 1)
    await self.client.set('peers', peers)
}
