import { GetPeersController } from "../controller/peers/get";
import { IHTTPServer } from "../drivers/base/httpServer";

type Params = {
    server: IHTTPServer,
    getPeersController: GetPeersController
}

export const makePeersRoutes = (params: Params) => {
    params.server.get('/peers', params.getPeersController.run)
}