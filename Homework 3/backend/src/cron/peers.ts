import { ICronClient } from "../drivers/base/cron";
import { UpdatePeersService } from "../service/peers/update";

type Params = {
    client: ICronClient,
    updatePeersService: UpdatePeersService
}

export const makeUpdatePeersCronJobs = (params: Params) => {
    params.client.schedule('* * * * * *', params.updatePeersService.run)
}
