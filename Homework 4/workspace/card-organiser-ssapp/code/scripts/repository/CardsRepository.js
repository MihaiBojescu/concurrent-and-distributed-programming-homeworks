import { SingletonFactory } from "../utils/SingletonFactory.js"

class CardsRepository {
    #enclave = void 0

    constructor(enclave) {
        this.#enclave = enclave
    }
}

export const cardsRepositoryInstance = new SingletonFactory(async () => {
    const securityContext = opendsu.loadAPI("sc")
    const enclave = new Promise((resolve, reject) => securityContext.getMainEnclave((err, mainEnclave) => err ? reject(err) : resolve(mainEnclave)))

    return new CardsRepository(enclave)
})
