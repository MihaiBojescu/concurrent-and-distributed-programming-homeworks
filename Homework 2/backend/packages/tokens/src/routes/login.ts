import { BaseRoute } from '../utils/route'
import { BaseService } from '../utils/service'
import { makeResponse } from '../utils/response'

type Input = {
    connectionId: string
    projectId: string
    token: string
}

interface LoginRoute extends BaseRoute<Input, any> { }

type Self = {
    service: BaseService<Input, any>
}

export const makeLoginRoute = (service: BaseService<Input, any>): LoginRoute => {
    const self: Self = {
        service
    }

    return {
        call: call(self)
    }
}

const call = (self: Self): LoginRoute['call'] => async (request) => {
    const connectionId = request.connectionId
    const projectId = request.data.projectId
    const token = request.data.token

    const response = await self.service.call({ connectionId, projectId, token })

    return makeResponse(
        200,
        request.action,
        request.requestId,
        response
    )
}
