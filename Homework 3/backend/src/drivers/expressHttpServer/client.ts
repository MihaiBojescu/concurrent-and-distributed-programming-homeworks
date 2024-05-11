import { IHTTPServer } from "../base/httpServer";
import { Application } from 'express-serve-static-core'
import express from 'express'
import bodyParser from 'body-parser'

type Self = {
    app: Application
}

export const makeExpressClient = (): IHTTPServer => {
    const self: Self = {
        app: express()
    }

    self.app.use(bodyParser.json())

    return {
        all: all(self),
        get: get(self),
        post: post(self),
        patch: patch(self),
        put: put(self),
        delete: remove(self),
        start: start(self)
    }
}

const all = (self: Self): IHTTPServer['all'] => (path, callback) => {
    self.app.all(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const get = (self: Self): IHTTPServer['get'] => (path, callback) => {
    self.app.get(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const post = (self: Self): IHTTPServer['post'] => (path, callback) => {
    self.app.post(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const patch = (self: Self): IHTTPServer['patch'] => (path, callback) => {
    self.app.patch(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const put = (self: Self): IHTTPServer['put'] => (path, callback) => {
    self.app.put(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const remove = (self: Self): IHTTPServer['delete'] => (path, callback) => {
    self.app.delete(path, async (req, res) => {
        const result = await callback(req as any)
        res.status(result.statusCode).send(result.body)
    })
}

const start = (self: Self): IHTTPServer['start'] => (address, port) => {
    self.app.listen(port, address)
}