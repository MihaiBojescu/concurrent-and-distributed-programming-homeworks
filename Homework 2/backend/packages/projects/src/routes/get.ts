import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
    projectId: string
}

interface GetRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeGetRoute = (service: BaseService<Input, any>): GetRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): GetRoute['call'] => async (request) => {
    const connectionId = request.connectionId
    const projectId = request.data.projectId

    const response = await self.service.call({ connectionId, projectId })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
