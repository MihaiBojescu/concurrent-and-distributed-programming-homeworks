import process from 'process'
import redis from 'redis'
import { makeConnectService } from './src/services/connect'
import { makeDisconnectService } from './src/services/disconnect'
import { makeConnectRoute } from './src/routes/connect'
import { makeDisconnectRoute } from './src/routes/disconnect'
import { makeRouter } from './src/utils/router'
import { makeLogger } from './src/utils/logger'

export const handler = async (event: any, _context: any) => {
    const REDIS_HOST = process.env['REDIS_HOST']
    const REDIS_PORT = !!process.env['REDIS_PORT'] ? Number(process.env['REDIS_PORT']) : undefined

    const redisClient = await redis.createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` }).connect() as any

    const logger = makeLogger()

    const connectService = makeConnectService(redisClient)
    const disconnectService = makeDisconnectService(redisClient)

    const connectRoute = makeConnectRoute(connectService)
    const disconnectRoute = makeDisconnectRoute(disconnectService)

    const router = makeRouter(logger)
    router.register('$connect', connectRoute)
    router.register('$disconnect', disconnectRoute)

    const response = await router.call(event)

    return response.toLambdaResponse()
}
