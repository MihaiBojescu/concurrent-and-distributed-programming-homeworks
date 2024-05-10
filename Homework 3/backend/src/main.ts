import { tidyEnv } from "tidyenv"
import { makeGetStatisticsController } from "./controller/statistics/get"
import { makeExpressClient } from "./drivers/expressHttpServer/client"
import { makeInMemoryCacheClient } from "./drivers/inMemoryCache/client"
import { makeTidyEnvClient } from "./drivers/tidyenvEnvironmentClient/client"
import { makeStatisticsRepository } from "./repository/statistics"
import { makeStatisticsRoutes } from "./routes/statistics"
import { makeGetStatisticsService } from "./service/statistics/get"

export const main = async () => {
    const env = makeTidyEnvClient({
        HOST: tidyEnv.str(),
        PORT: tidyEnv.num()
    })
    const cache = makeInMemoryCacheClient()
    const server = makeExpressClient()

    const statisticsRepository = makeStatisticsRepository({ client: cache })

    const getStatisticsService = makeGetStatisticsService({ repository: statisticsRepository })
    const getStatisticsController = makeGetStatisticsController({ service: getStatisticsService })

    makeStatisticsRoutes({ server, getStatisticsController })

    server.start(env.get().HOST, env.get().PORT)
}
