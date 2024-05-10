export type IHTTPClientResponse<Headers, Body> = {
    url: string,
    statusCode: string
    headers: Headers
    body: Body
}

export interface IHTTPClient {
    get<Headers, Body>(url: string, headers: Record<string, string>, query: Record<string, string>): Promise<IHTTPClientResponse<Headers, Body>>
    post<Headers, Body>(url: string, headers: Record<string, string>, query: Record<string, string>, body: unknown): Promise<IHTTPClientResponse<Headers, Body>>
    patch<Headers, Body>(url: string, headers: Record<string, string>, query: Record<string, string>, body: unknown): Promise<IHTTPClientResponse<Headers, Body>>
    put<Headers, Body>(url: string, headers: Record<string, string>, query: Record<string, string>, body: unknown): Promise<IHTTPClientResponse<Headers, Body>>
    delete<Headers, Body>(url: string, headers: Record<string, string>, query: Record<string, string>): Promise<IHTTPClientResponse<Headers, Body>>
}
