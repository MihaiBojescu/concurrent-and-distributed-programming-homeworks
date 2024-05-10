import redis from 'redis'
import pg from 'pg'
import aws from 'aws-sdk'

type Clients = {
    callbackAPIClient: aws.ApiGatewayManagementApi
    redisClient: redis.RedisClientType
    postgresClient: pg.Pool
}
type Singleton<T> = { current: null | T }

const instance: Singleton<Clients> = { current: null }

export const makeClients = async (
    callbackApiDomainName?: string,
    callbackApiStage?: string,
    redisHost?: string,
    redisPort?: number,
    databaseHost?: string,
    databasePort?: number,
    databaseDatabase?: string,
    databaseUsername?: string,
    databasePassword?: string,
) => {
    if (!instance.current) {
        const callbackAPIClient = new aws.ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: callbackApiDomainName + '/' + callbackApiStage,
        })
        const redisClient = await redis.createClient({ url: `redis://${redisHost}:${redisPort}` }).connect() as any
        const postgresClient = new pg.Pool({
            host: databaseHost,
            port: databasePort,
            database: databaseDatabase,
            user: databaseUsername,
            password: databasePassword
        })

        instance.current = {
            callbackAPIClient,
            redisClient,
            postgresClient
        }
    }

    return instance.current
}
