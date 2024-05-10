import { ICacheClient } from "../base/cache";

type Self = {
    cache: Record<string, unknown>
    timers: Record<string, NodeJS.Timeout>
}

export const makeInMemoryCacheClient = (): ICacheClient => {
    const self: Self = {
        cache: {},
        timers: {}
    }

    return {
        get: get(self),
        set: set(self),
        expire: expire(self),
        clear: clear(self)
    }
}

const get = (self: Self): ICacheClient['get'] => async <T>(key: string) => {
    return self.cache[key] as T || null
}

const set = (self: Self): ICacheClient['set'] => async (key, value) => {
    self.cache[key] = value
}

const expire = (self: Self): ICacheClient['expire'] => async (key, ttl) => {
    if (!self.timers[key]) {
        return
    }

    if (ttl < 0) {
        clearTimeout(self.timers[key])
        delete self.timers[key]
        return
    }

    self.timers[key] = setTimeout(() => {
        delete self.cache[key]
    }, ttl)
}

const clear = (self: Self): ICacheClient['clear'] => async () => {
    self.cache = {}

    for (const key in self.timers) {
        clearTimeout(self.timers[key])
        delete self.timers[key]
    }
}
