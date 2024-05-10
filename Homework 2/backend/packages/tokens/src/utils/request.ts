export type Request<T> = {
    event: any,
    route: string
    connectionId: string
    action: string | undefined
    requestId: string | undefined
    data: T
}

export const makeRequest = <T>(event: any): Request<T> => {
    let body = event.body

    try {
        body = JSON.parse(event.body)
    } catch { }

    return {
        event: event,
        route: event.requestContext.routeKey,
        connectionId: event.requestContext.connectionId,
        action: body?.action,
        requestId: body?.requestId,
        data: body?.data || null
    }
}
