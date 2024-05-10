import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
    name: string
    description: string
}

interface CreateRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeCreateRoute = (service: BaseService<Input, any>): CreateRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): CreateRoute['call'] => async (request) => {
    const connectionId = request.connectionId
    const name = request.data.name
    const description = request.data.description

    const response = await self.service.call({ connectionId, name, description })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
