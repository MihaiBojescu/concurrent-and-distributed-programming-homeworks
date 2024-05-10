import process from 'process'
import { makeCreateRoute } from './src/routes/create'
import { makeGetRoute } from './src/routes/get'
import { makeGetAllRoute } from './src/routes/getAll'
import { makeSubscribeRoute } from './src/routes/subscribe'
import { makeUnsubscribeRoute } from './src/routes/unsubscribe'
import { makeCreateService } from './src/services/create'
import { makeGetService } from './src/services/get'
import { makeGetAllService } from './src/services/getAll'
import { makeSubscribeService } from './src/services/subscribe'
import { makeUnsubscribeService } from './src/services/unsubscribe'
import { makeClients } from './src/utils/clients'
import { makeLogger } from './src/utils/logger'
import { makeRouter } from './src/utils/router'

export const handler = async (event: any, _context: any) => {
    const REDIS_HOST = process.env['REDIS_HOST']
    const REDIS_PORT = !!process.env['REDIS_PORT'] ? Number(process.env['REDIS_PORT']) : undefined
    const DATABASE_HOST = process.env['DATABASE_HOST']
    const DATABASE_PORT = !!process.env['DATABASE_PORT'] ? Number(process.env['DATABASE_PORT']) : undefined
    const DATABASE_DATABASE = process.env['DATABASE_DATABASE']
    const DATABASE_USERNAME = process.env['DATABASE_USERNAME']
    const DATABASE_PASSWORD = process.env['DATABASE_PASSWORD']

    const clients = await makeClients(
        event.requestContext.domainName,
        event.requestContext.stage,
        REDIS_HOST,
        REDIS_PORT,
        DATABASE_HOST,
        DATABASE_PORT,
        DATABASE_DATABASE,
        DATABASE_USERNAME,
        DATABASE_PASSWORD
    )
    const callbackAPIClient = clients.callbackAPIClient
    const redisClient = clients.redisClient
    const postgresClient = clients.postgresClient

    const logger = makeLogger()

    const getService = makeGetService(redisClient, postgresClient)
    const getAllService = makeGetAllService(redisClient, postgresClient)
    const createService = makeCreateService(callbackAPIClient, redisClient, postgresClient)
    const subscribeService = makeSubscribeService(redisClient, postgresClient)
    const unsubscribeService = makeUnsubscribeService(redisClient, postgresClient)

    const getRoute = makeGetRoute(getService)
    const getAllRoute = makeGetAllRoute(getAllService)
    const createRoute = makeCreateRoute(createService)
    const subscribeRoute = makeSubscribeRoute(subscribeService)
    const unsubscribeRoute = makeUnsubscribeRoute(unsubscribeService)

    const router = makeRouter(logger)
    router.register('visualisations-get', getRoute)
    router.register('visualisations-get-all', getAllRoute)
    router.register('visualisations-create', createRoute)
    router.register('visualisations-create-subscribe', subscribeRoute)
    router.register('visualisations-create-unsubscribe', unsubscribeRoute)

    const response = await router.call(event)

    return response.toLambdaResponse()
}
