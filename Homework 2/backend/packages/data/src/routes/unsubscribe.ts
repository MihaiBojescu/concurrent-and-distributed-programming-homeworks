import { makeResponse } from '../utils/response'
import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'

type Input = {
    connectionId: string
    visualisationId: string
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
    const visualisationId = request.data.visualisationId

    const response = await self.service.call({ connectionId, visualisationId })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
