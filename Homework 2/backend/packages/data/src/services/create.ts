
import redis from 'redis'
import pg from 'pg'
import aws from 'aws-sdk'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    visualisationId: string
    value: number
}

interface CreateService extends BaseService<Input, any> { }

type Self = {
    callbackAPIClient: aws.ApiGatewayManagementApi
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool

    handleUserAuth: (visualisationId: string, user: { user_id: string }) => Promise<any>
    handleProjectAuth: (visualisationId: string, project: { project_id: string }) => Promise<any>
}

export const makeCreateService = (callbackAPIClient: aws.ApiGatewayManagementApi, redisClient: redis.RedisClientType, postgresClient: pg.Pool): CreateService => {
    const self: Self = {
        callbackAPIClient,
        redisClient,
        postgresClient,

        handleUserAuth: async () => undefined,
        handleProjectAuth: async () => undefined
    }
    self.handleUserAuth = handleUserAuth(self)
    self.handleProjectAuth = handleProjectAuth(self)

    return {
        call: call(self)
    }
}

const call = (self: Self): CreateService['call'] => async (input) => {
    const connectionId = input.connectionId
    const visualisationId = input.visualisationId
    const value = input.value

    const rawConnection = await self.redisClient.HGET("connections", connectionId)
    const connection = rawConnection && JSON.parse(rawConnection)
    const user = connection?.user
    const project = connection?.project

    if (!user && !project) {
        return {
            reason: 'Not authenticated'
        }
    }

    try {
        if (user) {
            await self.handleUserAuth(visualisationId, user)
        } else {
            await self.handleProjectAuth(visualisationId, project)
        }
    } catch (err) {
        return {
            reason: (err as Error).message
        }
    }

    const data = await self.postgresClient.query(`
        INSERT INTO data (visualisation_id, value, timestamp)
        VALUES ($1, $2, $3)
        RETURNING *
    `, [visualisationId, String(value), new Date().toISOString()])

    const connectionIds = await self.redisClient.SMEMBERS(`subscriptions:resources:data:${visualisationId}`)

    for await (const connectionId of connectionIds) {
        if (connection === input.connectionId) {
            continue
        }

        await self.callbackAPIClient.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
                action: "data-create",
                data: {
                    data: data.rows[0]
                }
            })
        }).promise()
    }

    return {
        data: data.rows[0]
    }
}

const handleUserAuth = (self: Self): Self['handleUserAuth'] => async (visualisationId, user) => {
    if (!user) {
        throw new Error('Not authenticated')
    }

    const userId = user.user_id

    const projectWithVisualisation = await self.postgresClient.query(`
        SELECT *
        FROM projects p
        INNER JOIN visualisations v ON p.project_id = v.project_id
        WHERE p.user_id = $1 AND v.visualisation_id = $2
    `, [userId, visualisationId])

    if (!projectWithVisualisation.rows[0]) {
        throw new Error('Not found')
    }
}

const handleProjectAuth = (self: Self): Self['handleProjectAuth'] => async (visualisationId, project) => {
    if (!project) {
        throw new Error('Not authenticated')
    }

    const projectId = project.project_id

    const projectWithVisualisation = await self.postgresClient.query(`
        SELECT *
        FROM projects p
        INNER JOIN visualisations v ON p.project_id = v.project_id
        WHERE p.project_id = $1 AND v.visualisation_id = $2
    `, [projectId, visualisationId])

    if (!projectWithVisualisation.rows[0]) {
        throw new Error('Not found')
    }
}
