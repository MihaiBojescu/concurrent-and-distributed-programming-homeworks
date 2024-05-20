import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class HomeController extends Controller {
    #cardsRepository = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading',
            cards: []
        }
        this.model.cards.push({ "id": "d7b0c2c0-2034-4c7e-8ffe-c3110390a6c2", "brand": "auchan", "description": "", "image": "assets/images/auchan.svg", "serial": "9999000690896" })

        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('home-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('home-controller-loaded', { detail: { error } })))

        document.addEventListener('home-controller-loaded', this.#onInit.bind(this))
    }

    async #onInit(event) {
        if (event.error) {
            console.error(err)
            this.model.state = 'error'
            return
        }

        this.#cardsRepository = await this.#cardsRepository
        this.onTagClick('add-card', this.#onAddCard.bind(this))
        this.onTagClick('view-card', this.#onViewCard.bind(this))
        this.model.state = 'loaded'

        await this.#reloadCards()
    }

    async #onAddCard(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('select-card-brand')
    }

    async #onViewCard(model, target, event) {
        event.stopImmediatePropagation()

        if (this.model.state !== 'loaded') {
            return
        }

        const cardId = target.parentElement.id
        const card = this.model.cards.find(entry => entry.id === cardId)

        if (!card) {
            return
        }

        navigateToPageTag('view-card', { card: { ...card } })
    }

    async #reloadCards() {
        if (this.model.state !== 'loaded') {
            return
        }

        this.model.cards = await this.#cardsRepository.getAll()
    }
}
