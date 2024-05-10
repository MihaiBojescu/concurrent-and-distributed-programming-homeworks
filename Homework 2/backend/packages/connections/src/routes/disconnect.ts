import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
}

interface DisconnectRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeDisconnectRoute = (service: BaseService<Input, any>): DisconnectRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): DisconnectRoute['call'] => async (request) => {
    const connectionId = request.connectionId

    await self.service.call({ connectionId })

    return makeResponse(
        200,
        undefined,
        undefined,
        undefined
    )
}
