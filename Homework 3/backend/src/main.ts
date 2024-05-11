import { tidyEnv } from "tidyenv"
import { makeGetStatisticsController } from "./controller/statistics/get"
import { makeExpressClient } from "./drivers/expressHttpServer/client"
import { makeInMemoryCacheClient } from "./drivers/inMemoryCache/client"
import { makeTidyEnvClient } from "./drivers/tidyenvEnvironmentClient/client"
import { makeStatisticsRepository } from "./repository/statistics"
import { makeStatisticsRoutes } from "./routes/statistics"
import { makeGetStatisticsService } from "./service/statistics/get"
import { makePeersRepository } from "./repository/peers"
import { makeApplicationForwardingService } from "./service/application/forward"
import { makeAxiosClient } from "./drivers/axiosHttpClient/client"
import { makeApplicationForwardingController } from "./controller/application/forward"
import { makeApplicationForwardingRoutes } from "./routes/forward"

export const main = async () => {
    const env = makeTidyEnvClient({
        HOST: tidyEnv.str({ default: '0.0.0.0' }),
        PORT: tidyEnv.num({ default: 2024 }),
        MANAGEMENT_HOST: tidyEnv.str({ default: '0.0.0.0' }),
        MANAGEMENT_PORT: tidyEnv.num({ default: 2025 }),
        APPLICATION_HOST: tidyEnv.str(),
        APPLICATION_PORT: tidyEnv.num(),
        PEERS_TO_ASK: tidyEnv.num({ default: 5 })
    })
    const httpClient = makeAxiosClient()
    const cache = makeInMemoryCacheClient()
    const managementServer = makeExpressClient()
    const applicationForwardingServer = makeExpressClient()

    const statisticsRepository = makeStatisticsRepository({ client: cache })
    const peersRepository = makePeersRepository({ client: cache })

    const getStatisticsService = makeGetStatisticsService({ repository: statisticsRepository })
    const applicationForwardingService = makeApplicationForwardingService({
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
    makeApplicationForwardingRoutes({ server: applicationForwardingServer, applicationForwardingController })

    managementServer.start(env.get().MANAGEMENT_HOST, env.get().MANAGEMENT_PORT)
    applicationForwardingServer.start(env.get().HOST, env.get().PORT)
}
