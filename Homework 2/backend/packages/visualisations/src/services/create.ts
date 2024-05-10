
import redis from 'redis'
import pg from 'pg'
import aws from 'aws-sdk'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    projectId: string
    name: string
    description: string
    type: string
}

interface CreateService extends BaseService<Input, any> { }

type Self = {
    callbackAPIClient: aws.ApiGatewayManagementApi
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool
}

export const makeCreateService = (callbackAPIClient: aws.ApiGatewayManagementApi, redisClient: redis.RedisClientType, postgresClient: pg.Pool): CreateService => {
    const self: Self = {
        callbackAPIClient,
        redisClient,
        postgresClient
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): CreateService['call'] => async (input) => {
    const connectionId = input.connectionId
    const projectId = input.projectId
    const name = input.name
    const description = input.description
    const type = input.type

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
        INSERT INTO visualisations (project_id, name, description, type)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [projectId, name, description, type])

    const connectionIds = await self.redisClient.SMEMBERS(`subscriptions:resources:visualisations:${projectId}`)

    for await (const connectionId of connectionIds) {
        if (connection === input.connectionId) {
            continue
        }

        await self.callbackAPIClient.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
                action: "visualisations-create",
                data: {
                    visualisation: visualisations.rows[0]
                }
            })
        }).promise()
    }

    return {
        visualisation: visualisations.rows[0]
    }
}