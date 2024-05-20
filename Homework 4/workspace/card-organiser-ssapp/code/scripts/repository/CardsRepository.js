import { SingletonFactory } from "../utils/SingletonFactory.js"
import { brandsByValue } from '../data/brands.js'

const opendsu = require('opendsu')

class CardsRepository {
    #enclave = void 0

    constructor(enclave) {
        this.#enclave = enclave
    }

    async getAll() {
        try {
            const result = await this.#enclave.getAllRecordsAsync('cards')
            return result.map((card) => this.#mapToRecord(card))
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
            serial
        }

        const batchId = await this.#enclave.safeBeginBatchAsync()
        try {
            await this.#enclave.insertRecordAsync('cards', id, card)
        } finally {
            await this.#enclave.commitBatchAsync(batchId)
        }

        return this.#mapToRecord(card)
    }

    async removeCard(id) {
        const batchId = await this.#enclave.safeBeginBatchAsync()

        try {
            await this.#enclave.deleteRecordAsync('cards', id)
        } finally { 
            await this.#enclave.commitBatchAsync(batchId)
        }

        return
    }

    #mapToRecord(card) {
        return {
            id: card.id,
            brand: card.brand,
            title: brandsByValue[card.brand]?.name,
            description: card.description,
            type: card.type,
            image: brandsByValue[card.brand]?.image || brandsByValue['unknown'].image,
            serial: card.serial
        }
    }
}

export const cardsRepositoryInstance = new SingletonFactory(async () => {
    const securityContext = opendsu.loadAPI("sc")
    const enclave = await new Promise((resolve, reject) => securityContext.getMainEnclave((err, mainEnclave) => err ? reject(err) : resolve(mainEnclave)))

    return new CardsRepository(enclave)
})
