import { ApplicationForwardingController } from "../controller/application/forward";
import { IHTTPServer } from "../drivers/base/httpServer";

type Params = {
    server: IHTTPServer,
    applicationForwardingController: ApplicationForwardingController
}

export const makeApplicationForwardingRoutes = (params: Params) => {
    params.server.all('*', params.applicationForwardingController.run)
}