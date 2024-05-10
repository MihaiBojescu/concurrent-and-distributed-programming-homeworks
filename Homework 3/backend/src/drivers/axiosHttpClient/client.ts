import * as axios from 'axios'
import { IHTTPClient } from '../base/httpClient'

type Self = {
    client: axios.AxiosInstance
}

export const makeAxiosClient = (): IHTTPClient => {
    const self: Self = {
        client: axios.default.create()
    }

    return {
        get: get(self),
        post: post(self),
        patch: patch(self),
        put: put(self),
        delete: remove(self),
    }
}

const get = (self: Self): IHTTPClient['get'] => async (url, headers, query) => {
    return self.client.get(url, {
        headers,
        params: query
    })
}

const post = (self: Self): IHTTPClient['post'] => async (url, headers, query, body) => {
    return self.client.post(url, body, {
        headers,
        params: query
    })
}

const patch = (self: Self): IHTTPClient['patch'] => async (url, headers, query, body) => {
    return self.client.patch(url, body, {
        headers,
        params: query
    })
}

const put = (self: Self): IHTTPClient['put'] => async (url, headers, query, body) => {
    return self.client.put(url, body, {
        headers,
        params: query
    })
}

const remove = (self: Self): IHTTPClient['delete'] => async (url, headers, query) => {
    return self.client.delete(url, {
        headers,
        params: query
    })
}
