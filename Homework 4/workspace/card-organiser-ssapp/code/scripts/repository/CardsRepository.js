import { SingletonFactory } from "../utils/SingletonFactory.js"

const opendsu = require('opendsu')


class CardsRepository {
    #enclave = void 0

    constructor(enclave) {
        this.#enclave = enclave
    }

    async getAll() {
        return this.#enclave.getAllRecordsAsync('cards')
    }

    async addCard(name, brand, serial) {
        const existing = await this.#enclave.getRecordAsync('cards', brand)

        if (!existing) {
            return await this.#enclave.insertRecordAsync('cards', brand, [{ name, serial }])
        }

        existing.push({ name, serial })

        return await this.#enclave.updateRecordAsync('cards', brand, [{ name, serial }])
    }
}

export const cardsRepositoryInstance = new SingletonFactory(async () => {
    const securityContext = opendsu.loadAPI("sc")
    const enclave = await new Promise((resolve, reject) => securityContext.getMainEnclave((err, mainEnclave) => err ? reject(err) : resolve(mainEnclave)))

    return new CardsRepository(enclave)
})
