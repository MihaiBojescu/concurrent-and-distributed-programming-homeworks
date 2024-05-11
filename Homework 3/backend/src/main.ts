import { tidyEnv } from "tidyenv"
import { makeApplicationForwardingController } from "./controller/application/forward"
import { makeGetStatisticsController } from "./controller/statistics/get"
import { makeUpdatePeersCronJobs } from "./cron/peers"
import { makeAxiosClient } from "./drivers/axiosHttpClient/client"
import { makeCronClient } from "./drivers/cronClient/client"
import { makeExpressClient } from "./drivers/expressHttpServer/client"
import { makeInMemoryCacheClient } from "./drivers/inMemoryCache/client"
import { makeTidyEnvClient } from "./drivers/tidyenvEnvironmentClient/client"
import { makePeersRepository } from "./repository/peers"
import { makeStatisticsRepository } from "./repository/statistics"
import { makeApplicationForwardingRoutes } from "./routes/forward"
import { makeStatisticsRoutes } from "./routes/statistics"
import { makeApplicationForwardingService } from "./service/application/forward"
import { makeGetStatisticsService } from "./service/statistics/get"
import { makeUpdateStatisticsService } from "./service/statistics/update"
import { makeUpdatePeersService } from "./service/peers/update"
import { makeDNSClient } from "./drivers/dnsClient/client"
import { makeWinstonClient } from "./drivers/winstonLogger/client"
import { makeUpdateStatisticsCronJobs } from "./cron/statistics"

export const main = async () => {
    const env = makeTidyEnvClient({
        HOST: tidyEnv.str({ default: '0.0.0.0' }),
        PORT: tidyEnv.num({ default: 2024 }),
        MANAGEMENT_HOST: tidyEnv.str({ default: '0.0.0.0' }),
        MANAGEMENT_PORT: tidyEnv.num({ default: 2025 }),
        APPLICATION_HOST: tidyEnv.str(),
        APPLICATION_PORT: tidyEnv.num(),
        DNS_HOST: tidyEnv.str({ default: '127.0.0.1' }),
        DNS_PORT: tidyEnv.num({ default: 53 }),
        PEERS_TO_ASK: tidyEnv.num({ default: 5 }),
        LOG_LEVEL: tidyEnv.str({ default: 'info' })
    })
    const logger = makeWinstonClient({ level: env.get().LOG_LEVEL })
    const cronClient = makeCronClient()
    const httpClient = makeAxiosClient()
    const dnsClient = makeDNSClient({ host: env.get().DNS_HOST, port: env.get().DNS_PORT })
    const cache = makeInMemoryCacheClient()
    const managementServer = makeExpressClient()
    const applicationForwardingServer = makeExpressClient()

    const statisticsRepository = makeStatisticsRepository({ client: cache })
    const peersRepository = makePeersRepository({ client: cache })

    const getStatisticsService = makeGetStatisticsService({ logger, repository: statisticsRepository })
    const updateStatisticsService = makeUpdateStatisticsService({ logger, repository: statisticsRepository })
    const updatePeersService = makeUpdatePeersService({
        logger,
        dnsClient,
        repository: peersRepository,
        self: {
            host: env.get().MANAGEMENT_HOST,
            port: env.get().MANAGEMENT_PORT
        }
    })
    const applicationForwardingService = makeApplicationForwardingService({
        logger,
        client: httpClient,
        peersRepository,
        statisticsRepository,
        peersToAsk: env.get().PEERS_TO_ASK,
        app: {
            host: env.get().APPLICATION_HOST,
            port: env.get().APPLICATION_PORT
        }
    })

    const getStatisticsController = makeGetStatisticsController({ service: getStatisticsService })
    const applicationForwardingController = makeApplicationForwardingController({ service: applicationForwardingService })

    makeStatisticsRoutes({ server: managementServer, getStatisticsController })
    makeUpdatePeersCronJobs({ client: cronClient, updatePeersService })
    makeUpdateStatisticsCronJobs({ client: cronClient, updateStatisticsService })
    makeApplicationForwardingRoutes({ server: applicationForwardingServer, applicationForwardingController })

    managementServer.start(env.get().MANAGEMENT_HOST, env.get().MANAGEMENT_PORT)
    applicationForwardingServer.start(env.get().HOST, env.get().PORT)
}
