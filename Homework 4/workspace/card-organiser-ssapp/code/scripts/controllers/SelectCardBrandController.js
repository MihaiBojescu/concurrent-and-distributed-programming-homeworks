import { brands } from '../data/brands.js'

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class SelectCardBrandController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            brand: '',
            brands
        }

        this.onTagClick('select-card-brand', this.#onSelectCardBrand.bind(this))
        this.onTagClick('go-back', this.#onGoBack.bind(this))
    }

    async #onSelectCardBrand(model, target, event) {
        this.model.brand = target.children[1].innerText
        navigateToPageTag('scan-card', { card: { brand: this.model.brand.toString() } })

    }

    async #onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('home')
    }
}
