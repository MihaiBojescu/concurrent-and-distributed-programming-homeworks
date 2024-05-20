import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class ScanCardController extends Controller {
    #cardsRepository = void 0
    #qrScanner = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            brand: window.history.state.state.card.brand.toString(),
            type: '',
            serial: '',
        }

        this.#qrScanner = new Html5Qrcode("reader")
        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error } })))

        this.onTagClick('go-back', this.#onGoBack.bind(this))

        document.addEventListener('add-card-controller-loaded', this.#onInit.bind(this))
    }

    async #onInit() {
        try {
            const devices = await Html5Qrcode.getCameras()
            const cameraId = devices[0]?.id

            this.#cardsRepository = await this.#cardsRepository
            this.#qrScanner.start(
                cameraId,
                { fps: 10 },
                this.#onScanSuccess.bind(this),
                this.#onScanFailed.bind(this)
            )
        } catch (error) {
            console.error(error)
        }
    }

    async #onScanSuccess(decodedText, decodedResult) {
        this.model.serial = decodedText
        this.model.type = decodedResult.result.format.formatName

        try {
            await this.#cardsRepository.addCard(
                this.model.brand,
                '',
                this.model.type,
                this.model.serial
            )
        } finally {
            navigateToPageTag('home')
        }
    }

    #onScanFailed(error) {
    }

    #onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('select-card-brand')
    }

    async onDisconnectedCallback() {
        try {
            await this.#qrScanner.stop()
        } catch { }

        try {
            await this.#qrScanner.clear()
        } catch { }
    }
}