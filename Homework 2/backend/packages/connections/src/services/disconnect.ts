
import redis from 'redis'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
}

interface DisconnectService extends BaseService<Input, any> { }

type Self = {
    redisClient: redis.RedisClientType

    handleUser(connectionId: string, user: { user_id: string }): Promise<void>
    handleProject(connectionId: string, project: { project_id: string }): Promise<void>
}

export const makeDisconnectService = (redisClient: redis.RedisClientType): DisconnectService => {
    const self: Self = {
        redisClient,
        handleUser: async () => undefined,
        handleProject: async () => undefined
    }
    self.handleUser = handleUser(self)
    self.handleProject = handleProject(self)

    return {
        call: call(self)
    }
}

const call = (self: Self): DisconnectService['call'] => async (input) => {
    const connectionId = input.connectionId

    const rawConnection = await self.redisClient.HGET("connections", connectionId)
    const connection = rawConnection && JSON.parse(rawConnection)
    const user = connection?.user
    const project = connection?.project

    if (user) {
        await self.handleUser(connectionId, user)
    }

    if (project) {
        await self.handleProject(connectionId, project)
    }

    await self.redisClient.HDEL('connections', connectionId)
}

const handleUser = (self: Self): Self['handleUser'] => async (connectionId, user) => {
    await self.redisClient.SREM(`users:${user.user_id}`, connectionId)

    const visualisationIds = await self.redisClient.SMEMBERS(`subscriptions:connections:data:${connectionId}`)
    const projectIds = await self.redisClient.SMEMBERS(`subscriptions:connections:visualisations:${connectionId}`)
    const tokenProjectIds = await self.redisClient.SMEMBERS(`subscriptions:connections:tokens:${connectionId}`)
    const userIds = await self.redisClient.SMEMBERS(`subscriptions:connections:projects:${connectionId}`)

    for (const visualisationId of visualisationIds) {
        await self.redisClient.SREM(`subscriptions:resources:data:${visualisationId}`, connectionId)
    }
    for (const tokenProjectId of tokenProjectIds) {
        await self.redisClient.SREM(`subscriptions:resources:tokens:${tokenProjectId}`, connectionId)
    }
    for (const projectId of projectIds) {
        await self.redisClient.SREM(`subscriptions:resources:visualisations:${projectId}`, connectionId)
    }
    for (const userId of userIds) {
        await self.redisClient.SREM(`subscriptions:resources:projects:${userId}`, connectionId)
    }

    await self.redisClient.DEL(`subscriptions:connections:data:${connectionId}`)
    await self.redisClient.DEL(`subscriptions:connections:visualisations:${connectionId}`)
    await self.redisClient.DEL(`subscriptions:connections:tokens:${connectionId}`)
    await self.redisClient.DEL(`subscriptions:connections:projects:${connectionId}`)
}

const handleProject = (self: Self): Self['handleProject'] => async (connectionId, project) => {
    await self.redisClient.SREM(`projects:${project.project_id}`, connectionId)
}