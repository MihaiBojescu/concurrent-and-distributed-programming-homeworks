import { SingletonFactory } from "../utils/SingletonFactory.js"

const opendsu = require('opendsu')


class CardsRepository {
    #enclave = void 0

    constructor(enclave) {
        this.#enclave = enclave
    }

    async getAll() {
        try {
            const result = await this.#enclave.getAllRecordsAsync('cards')
            return result.map((card) => ({
                id: card.id,
                name: card.name,
                brand: card.brand,
                serial: card.serial
            }))
        } catch { }

        return []
    }

    async addCard(name, brand, serial) {
        let id = crypto.randomUUID()
        try {
            while (await this.#enclave.getRecordAsync('cards', id)) {
                id = crypto.randomUUID()
            }
        } catch { }

        const batchId = await this.#enclave.safeBeginBatchAsync()
        await this.#enclave.insertRecordAsync('cards', id, { id, brand, name, serial })
        await this.#enclave.commitBatchAsync(batchId)

        return { id, name, brand, serial }
    }

    async removeCard(id) {
        const batchId = await this.#enclave.safeBeginBatchAsync()

        try {
            await this.#enclave.deleteRecordAsync('cards', id)
        } catch { }

        await this.#enclave.commitBatchAsync(batchId)

        return
    }
}

export const cardsRepositoryInstance = new SingletonFactory(async () => {
    const securityContext = opendsu.loadAPI("sc")
    const enclave = await new Promise((resolve, reject) => securityContext.getMainEnclave((err, mainEnclave) => err ? reject(err) : resolve(mainEnclave)))

    return new CardsRepository(enclave)
})
