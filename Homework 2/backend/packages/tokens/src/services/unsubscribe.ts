
import redis from 'redis'
import pg from 'pg'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    projectId: string
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
    const projectId = input.projectId

    const rawConnection = await self.redisClient.HGET("connections", connectionId)
    const connection = rawConnection && JSON.parse(rawConnection)
    const user = connection?.user

    if (!user) {
        return {
            reason: 'Not authenticated'
        }
    }

    const userId = user.user_id

    const projects = await self.postgresClient.query(`
        SELECT *
        FROM projects p
        WHERE p.project_id = $1 AND p.user_id = $2
    `, [projectId, userId])

    if (!projects.rows[0]) {
        return {
            reason: 'Not found'
        }
    }

    await self.redisClient.SREM(`subscriptions:resources:tokens:${projectId}`, connectionId)
    await self.redisClient.SREM(`subscriptions:connections:tokens:${connectionId}`, projectId)

    return {
        subscribed: false
    }
}