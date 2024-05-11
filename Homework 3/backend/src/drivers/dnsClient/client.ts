import { Resolver } from "dns/promises";
import { IDNSClient } from "../base/dns";

type Params = {
    server: string
}

type Self = {
    client: Resolver
}

export const makeDNSClient = (params: Params): IDNSClient => {
    const self: Self = {
        client: new Resolver()
    }

    self.client.setServers([params.server])

    return {
        resolve4: resolve4(self)
    }
}

const resolve4 = (self: Self): IDNSClient['resolve4'] => async (hostname) => {
    return self.client.resolve4(hostname)
}
