import { makeGetStatisticsController } from "./controller/statistics/get"
import { makeExpressClient } from "./drivers/express/client"
import { makeInMemoryCacheClient } from "./drivers/inMemoryCache/client"
import { makeStatisticsRepository } from "./repository/statistics"
import { makeStatisticsRoutes } from "./routes/statistics"
import { makeGetStatisticsService } from "./service/statistics/get"

export const main = async () => {
    const cache = makeInMemoryCacheClient()
    const server = makeExpressClient()

    const statisticsRepository = makeStatisticsRepository({ client: cache })

    const getStatisticsService = makeGetStatisticsService({ repository: statisticsRepository })
    const getStatisticsController = makeGetStatisticsController({ service: getStatisticsService })

    makeStatisticsRoutes({ server, getStatisticsController })

    server.start('0.0.0.0', 2024)
}
