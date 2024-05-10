
import redis from 'redis'
import pg from 'pg'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    visualisationId: string
}

interface GetAllService extends BaseService<Input, any> { }

type Self = {
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool
}

export const makeGetAllService = (redisClient: redis.RedisClientType, postgresClient: pg.Pool): GetAllService => {
    const self: Self = {
        redisClient,
        postgresClient
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): GetAllService['call'] => async (input) => {
    const connectionId = input.connectionId
    const visualisationId = input.visualisationId

    const rawConnection = await self.redisClient.HGET("connections", connectionId)
    const connection = rawConnection && JSON.parse(rawConnection)
    const user = connection?.user

    if (!user) {
        return {
            reason: 'Not authenticated'
        }
    }

    const userId = user.user_id

    const projectWithVisualisation = await self.postgresClient.query(`
        SELECT *
        FROM projects p
        INNER JOIN visualisations v ON p.project_id = v.project_id
        WHERE p.user_id = $1 AND v.visualisation_id = $2
    `, [userId, visualisationId])

    if (!projectWithVisualisation.rows?.[0]) {
        return {
            reason: 'Not found'
        }
    }

    const data = await self.postgresClient.query(`
        SELECT *
        FROM data
        WHERE visualisation_id = $1
        ORDER BY timestamp DESC 
        LIMIT 256
    `, [visualisationId])

    return {
        data: data.rows
    }
}