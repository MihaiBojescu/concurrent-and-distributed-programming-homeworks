import { ICronClient } from "../drivers/base/cron";
import { UpdateStatisticsService } from "../service/statistics/update";

type Params = {
    client: ICronClient,
    updateStatisticsService: UpdateStatisticsService
}

export const makeUpdateStatisticsCronJobs = (params: Params) => {
    params.client.schedule('* * * * * *', params.updateStatisticsService.run)
}
