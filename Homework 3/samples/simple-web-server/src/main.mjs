import express from 'express'

export const main = () => {
    const app = express()
    const instances = []

    app.get('/instances', (req, res) => {
        console.log(`[${req.ip}:${req.socket.remotePort}] GET /instances`)

        res.status(200).send(instances)
    })

    app.get('/instances/:instanceId', (req, res) => {
        console.log(`[${req.ip}:${req.socket.remotePort}] GET /instances/${req.params.instanceId}`)

        const instanceId = Number(req.params.instanceId)
        const instance = instances.find(item => item.id === instanceId)

        if (!instance) {
            return res.status(404).send()
        }

        res.status(200).send(instance)
    })

    app.post('/instances', (req, res) => {
        console.log(`[${req.ip}:${req.socket.remotePort}] POST /instances`)

        const instance = { id: (instances[instances.length - 1] === undefined ? 0 : instances[instances.length - 1].id) + 1 }
        instances.push(instance)

        res.status(201).send(instance)
    })

    app.delete('/instances/:instanceId', (req, res) => {
        console.log(`[${req.ip}:${req.socket.remotePort}] DELETE /instances/${req.params.instanceId}`)

        const instanceId = Number(req.params.instanceId)
        const index = instances.findIndex(item => item.id === instanceId)
        instances.splice(index, 1)

        res.status(204).send()
    })

    app.listen(3000, '0.0.0.0')
}
