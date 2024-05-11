import * as axios from 'axios'
import { IHTTPClient, IHTTPClientResponse } from '../base/httpClient'

type Self = {
    client: axios.AxiosInstance
    
    transformResponse<Headers, Body>(response: axios.AxiosResponse): IHTTPClientResponse<Headers, Body>
}

export const makeAxiosClient = (): IHTTPClient => {
    const self: Self = {
        client: axios.default.create()
    } as Self
    self.transformResponse = transformResponse()

    self.client.defaults.validateStatus = () => true

    return {
        get: get(self),
        post: post(self),
        patch: patch(self),
        put: put(self),
        delete: remove(self),
    }
}

const get = (self: Self): IHTTPClient['get'] => async (url, headers, query) => {
    const response = await self.client.get(url, {
        headers,
        params: query
    })
    return self.transformResponse(response)
}

const post = (self: Self): IHTTPClient['post'] => async (url, headers, query, body) => {
    const response = await self.client.post(url, body, {
        headers,
        params: query
    })
    return self.transformResponse(response)
}

const patch = (self: Self): IHTTPClient['patch'] => async (url, headers, query, body) => {
    const response = await self.client.patch(url, body, {
        headers,
        params: query
    })
    return self.transformResponse(response)
}

const put = (self: Self): IHTTPClient['put'] => async (url, headers, query, body) => {
    const response = await self.client.put(url, body, {
        headers,
        params: query
    })
    return self.transformResponse(response)
}

const remove = (self: Self): IHTTPClient['delete'] => async (url, headers, query) => {
    const response = await self.client.delete(url, {
        headers,
        params: query,
    })
    return self.transformResponse(response)
}

const transformResponse = (): Self['transformResponse'] => response => ({
    statusCode: response.status,
    headers: response.headers as any,
    body: response.data
})