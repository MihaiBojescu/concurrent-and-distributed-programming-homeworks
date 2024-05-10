import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
}

interface GetAllRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeGetAllRoute = (service: BaseService<Input, any>): GetAllRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): GetAllRoute['call'] => async (request) => {
    const connectionId = request.connectionId

    const response = await self.service.call({ connectionId })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
