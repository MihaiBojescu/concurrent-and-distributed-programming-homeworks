
import redis from 'redis'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
}

interface ConnectService extends BaseService<Input, void> { }

type Self = {
    redisClient: redis.RedisClientType
}

export const makeConnectService = (redisClient: redis.RedisClientType): ConnectService => {
    const self: Self = {
        redisClient,
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): ConnectService['call'] => async (input) => {
    const connectionId = input.connectionId

    await self.redisClient.HSET('connections', connectionId, JSON.stringify({}))
}