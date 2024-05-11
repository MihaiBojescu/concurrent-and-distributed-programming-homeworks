export interface IHTTPServerRequest<Headers extends Record<string, string>, Query extends Record<string, string>, Body> {
    ip: string
    method: string
    path: string
    headers: Headers
    query: Query
    body: Body
}

export interface IHTTPServerResponse<Headers extends Record<string, string>, Body> {
    statusCode: number
    headers: Headers
    body: Body
}

export type IHTTPServerController<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody> = (req: IHTTPServerRequest<RequestHeaders, RequestQuery, RequestBody>) => Promise<IHTTPServerResponse<ResponseHeaders, ResponseBody>>

export interface IHTTPServer {
    all<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    get<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    post<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    patch<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    put<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    delete<RequestHeaders extends Record<string, string>, RequestQuery extends Record<string, string>, RequestBody, ResponseHeaders extends Record<string, string>, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void

    start(address: string, port: number): void
}