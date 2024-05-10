import crypto from 'crypto'
import redis from 'redis'
import pg from 'pg'
import aws from 'aws-sdk'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    projectId: string
    name: string
    description: string
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
        WHERE project_id = $1 AND user_id = $2
    `, [projectId, userId])

    if (!projects.rows[0]) {
        return {
            reason: 'Not found'
        }
    }

    let unique = false
    let uniqueTrials = 5
    let tokens: Awaited<Promise<pg.QueryResult<{}>>>

    while (!unique && uniqueTrials > 0) {
        try {
            uniqueTrials--

            const token = crypto.randomBytes(8).toString('base64')
            tokens = await self.postgresClient.query(`
                INSERT INTO tokens (project_id, name, description, token)
                VALUES ($1, $2, $3, $4)
                RETURNING *
            `, [projectId, name, description, token])
            
            unique = true
        } catch {
            unique = false
        }
    }

    if (uniqueTrials === 0 || !tokens!) {
        return {
            reason: 'Internal server error'
        }
    }

    const connectionIds = await self.redisClient.SMEMBERS(`subscriptions:resources:tokens:${projectId}`)

    for await (const connectionId of connectionIds) {
        if (connection === input.connectionId) {
            continue
        }

        await self.callbackAPIClient.postToConnection({
            ConnectionId: connectionId,
            Data: JSON.stringify({
                action: "tokens-create",
                data: {
                    token: tokens!.rows[0]
                }
            })
        }).promise()
    }

    return {
        token: tokens!.rows[0]
    }
}