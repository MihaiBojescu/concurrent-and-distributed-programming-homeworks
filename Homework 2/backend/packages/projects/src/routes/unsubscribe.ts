import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
}

interface UnsubscribeRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeUnsubscribeRoute = (service: BaseService<Input, any>): UnsubscribeRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): UnsubscribeRoute['call'] => async (request) => {
    const connectionId = request.connectionId

    const response = await self.service.call({ connectionId })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
