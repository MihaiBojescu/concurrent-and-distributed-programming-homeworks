export class SingletonFactory {
    #instance = void 0
    #callback = void 0

    constructor(callback) {
        this.#instance = void 0
        this.#callback = callback
    }

    get(...args) {
        if (this.#instance) {
            return this.#instance
        }

        this.#instance = this.#callback(...args)
        return this.#instance
    }
}
