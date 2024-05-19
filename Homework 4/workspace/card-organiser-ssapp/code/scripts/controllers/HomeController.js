import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { Controller } = WebCardinal.controllers;

export default class HomeController extends Controller {
    #cardsRepository = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading'
        }

        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('home-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('home-controller-loaded', { detail: { error } })))

        document.addEventListener('home-controller-loaded', this.onInit.bind(this))
    }

    async onInit(event) {
        if (event.error) {
            console.error(err)
            this.model.state = 'error'
            return
        }

        this.onTagClick('add-card', this.onAddCard.bind(this))
        this.#cardsRepository = await this.#cardsRepository
        this.model.state = 'loaded'

        await this.reloadCards()
    }

    async onAddCard(model, target, event) {
        event.stopImmediatePropagation()

        if (this.model.state !== 'loaded') {
            return
        }

        const name = document.querySelector('#name').value
        const brand = document.querySelector('#brand').value
        const serial = document.querySelector('#serial').value

        await this.#cardsRepository.addCard(name, brand, serial)
        await this.reloadCards()
    }

    async reloadCards() {
        if (this.model.state !== 'loaded') {
            return
        }

        this.model.cards = await this.#cardsRepository.getAll()
    }
}
