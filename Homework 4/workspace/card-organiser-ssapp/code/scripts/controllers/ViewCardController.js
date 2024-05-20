import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class AddCardController extends Controller {
    #cardsRepository = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading',
            card: { ...window.history.state.state.card }
        }

        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('view-card-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('view-card-controller-loaded', { detail: { error } })))

        document.addEventListener('view-card-controller-loaded', this.#onInit.bind(this))
        this.onTagClick('delete-card', this.#onRemoveCard.bind(this))
        this.onTagClick('go-back', this.#onGoBack.bind(this))
    }

    async #onInit(event) {
        if (event.error) {
            console.error(err)
            this.model.state = 'error'
            return
        }

        this.#cardsRepository = await this.#cardsRepository
        this.model.state = 'loaded'
    }

    async #onRemoveCard(model, target, event) {
        event.stopImmediatePropagation()

        await this.#cardsRepository.removeCard(this.model.card.id)
        navigateToPageTag('home')
    }

    async #onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('home')
    }
}
