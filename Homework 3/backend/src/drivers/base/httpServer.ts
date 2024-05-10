export interface IHTTPServerRequest<Headers, Query, Body> {
    path: string
    headers: Headers
    query: Query
    body: Body
}

export interface IHTTPServerResponse<Headers, Body> {
    statusCode: number
    headers: Headers
    body: Body
}

export type IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody> = (req: IHTTPServerRequest<RequestHeaders, RequestQuery, RequestBody>) => Promise<IHTTPServerResponse<ResponseHeaders, ResponseBody>>

export interface IHTTPServer {
    get<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    post<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    patch<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    put<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void
    delete<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>(path: string, callback: IHTTPServerController<RequestHeaders, RequestQuery, RequestBody, ResponseHeaders, ResponseBody>): void

    start(address: string, port: number): void
}