import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { Controller } = WebCardinal.controllers;

export default class AddCardController extends Controller {
    #cardsRepository = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading',
            cards: []
        }

        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error } })))

        document.addEventListener('add-card-controller-loaded', this.onInit.bind(this))
    }

    async onInit(event) {
        if (event.error) {
            console.error(err)
            this.model.state = 'error'
            return
        }

        this.#cardsRepository = await this.#cardsRepository
        this.model.state = 'loaded'
        this.onTagClick('go-back', this.onGoBack.bind(this))
    }

    async onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        this.navigateToPageTag('home')
    }
}
