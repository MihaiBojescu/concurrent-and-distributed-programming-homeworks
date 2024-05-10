import { GetStatisticsController } from "../controller/statistics/get";
import { IHTTPServer } from "../drivers/base/httpServer";

type Params = {
    server: IHTTPServer,
    getStatisticsController: GetStatisticsController
}

export const makeStatisticsRoutes = (params: Params) => {
    params.server.get('/statistics', params.getStatisticsController.run)
}