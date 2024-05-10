
import redis from 'redis'
import pg from 'pg'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    projectId: string
    visualisationId: string
}

interface GetService extends BaseService<Input, any> { }

type Self = {
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool
}

export const makeGetService = (redisClient: redis.RedisClientType, postgresClient: pg.Pool): GetService => {
    const self: Self = {
        redisClient,
        postgresClient
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): GetService['call'] => async (input) => {
    const connectionId = input.connectionId
    const projectId = input.projectId
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

    const projects = await self.postgresClient.query(`
        SELECT project_id
        FROM projects p
        WHERE p.project_id = $1 AND p.user_id = $2
    `, [projectId, userId])

    if (!projects.rows[0]) {
        return {
            reason: "Not found"
        }
    }

    const visualisations = await self.postgresClient.query(`
        SELECT *
        FROM visualisations v
        WHERE v.visualisationId = $1 AND v.project_id = $2
    `, [visualisationId, projectId])

    return {
        visualisation: visualisations?.rows?.[0] || null
    }
}