import { SingletonFactory } from "../utils/SingletonFactory.js"
import { brands } from '../data/brands.js'

const opendsu = require('opendsu')

const unknownImage = brands.find(entry => entry.value === 'unknown')
const images = brands.reduce((acc, entry) => {
    acc[entry.value] = entry.image
    return acc
}, {})

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
                brand: card.brand,
                description: card.description,
                type: card.type,
                image: card.image,
                serial: card.serial
            }))
        } catch { }

        return []
    }

    async addCard(brand, description, type, serial) {
    let id = crypto.randomUUID()
        try {
            while (await this.#enclave.getRecordAsync('cards', id)) {
                id = crypto.randomUUID()
            }
        } catch { }

        const card = {
            id,
            brand,
            description,
            type,
            image: this.#getImage(brand),
            serial
        }

        const batchId = await this.#enclave.safeBeginBatchAsync()
        await this.#enclave.insertRecordAsync('cards', id, card)
        await this.#enclave.commitBatchAsync(batchId)

        return card
    }

    async removeCard(id) {
        const batchId = await this.#enclave.safeBeginBatchAsync()

        try {
            await this.#enclave.deleteRecordAsync('cards', id)
        } catch { }

        await this.#enclave.commitBatchAsync(batchId)

        return
    }

    #getImage(brand) {
        return images[brand] || unknownImage
    }
}

export const cardsRepositoryInstance = new SingletonFactory(async () => {
    const securityContext = opendsu.loadAPI("sc")
    const enclave = await new Promise((resolve, reject) => securityContext.getMainEnclave((err, mainEnclave) => err ? reject(err) : resolve(mainEnclave)))

    return new CardsRepository(enclave)
})
