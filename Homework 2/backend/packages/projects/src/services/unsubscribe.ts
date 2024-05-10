
import redis from 'redis'
import pg from 'pg'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
}

interface UnsubscribeService extends BaseService<Input, any> { }

type Self = {
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool
}

export const makeUnsubscribeService = (redisClient: redis.RedisClientType, postgresClient: pg.Pool): UnsubscribeService => {
    const self: Self = {
        redisClient,
        postgresClient
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): UnsubscribeService['call'] => async (input) => {
    const connectionId = input.connectionId

    const rawConnection = await self.redisClient.HGET("connections", connectionId)
    const connection = rawConnection && JSON.parse(rawConnection)
    const user = connection?.user

    if (!user) {
        return {
            reason: 'Not authenticated'
        }
    }

    const userId = user.user_id

    await self.redisClient.SREM(`subscriptions:resources:projects:${userId}`, connectionId)
    await self.redisClient.SREM(`subscriptions:connections:projects:${connectionId}`, userId)
    
    return {
        subscribed: false
    }
}