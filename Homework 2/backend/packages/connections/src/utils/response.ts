type LambdaResponse = {
    statusCode: number,
} | {
    statusCode: number
    body: string
}

export type Response<T> = {
    statusCode: number,
    action: string | undefined
    requestId: string | undefined
    data: T

    toLambdaResponse(): LambdaResponse
}

type Self<T> = Pick<Response<T>, 'statusCode' | 'action' | 'requestId' | 'data'>


export const makeResponse = <T>(
    statusCode: number,
    action: string | undefined,
    requestId: string | undefined,
    data: T
): Response<T> => {
    const self: Self<T> = {
        statusCode,
        action,
        requestId,
        data
    }

    return {
        ...self,
        toLambdaResponse: toLambdaResponse(self)
    }
}

const toLambdaResponse = <T>(self: Self<T>): Response<T>['toLambdaResponse'] => () => ({
    statusCode: self.statusCode,
    ...(!self.requestId && !self.action && !self.data
        ? undefined
        : {
            body: JSON.stringify({
                requestId: self.requestId,
                action: self.action,
                data: self.data
            })
        }
    )
})
