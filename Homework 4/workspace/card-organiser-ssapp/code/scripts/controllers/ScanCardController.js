import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class ScanCardController extends Controller {
    #done = false
    #stream = void 0
    #video = void 0
    #canvas = void 0
    #context = void 0
    #cardsRepository = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            brand: window.history.state.state.card.brand.toString(),
            type: '',
            serial: '',
        }

        this.#done = false
        this.#stream = navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        this.#video = document.querySelector('.page-cover video')
        this.#canvas = new OffscreenCanvas(window.screen.availWidth, window.screen.availHeight)
        this.#context = this.#canvas.getContext('2d')
        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error } })))

        this.onTagClick('go-back', this.#onGoBack.bind(this))

        document.addEventListener('add-card-controller-loaded', this.#onInit.bind(this))
    }

    async #onInit() {
        try {
            this.#cardsRepository = await this.#cardsRepository
            this.#stream = await this.#stream
            this.#video.srcObject = this.#stream

            window.requestAnimationFrame(this.#videoLoop.bind(this))
        } catch (error) {
            console.error(error)
        }
    }

    async #videoLoop() {
        await this.#processVideo()

        if (this.#done) {
            return
        }

        window.requestAnimationFrame(this.#videoLoop.bind(this))
    }

    async #processVideo() {
        this.#canvas.width = this.#video.naturalWidth || this.#video.videoWidth || this.#video.width
        this.#canvas.height = this.#video.naturalHeight || this.#video.videoHeight || this.#video.height

        if (!this.#canvas.width || !this.#canvas.height) {
            return
        }

        this.#context.drawImage(this.#video, 0, 0)

        const imageData = this.#context.getImageData(0, 0, this.#canvas.width, this.#canvas.height)
        const symbols = await zbarWasm.scanImageData(imageData)
        const decodedSymbols = symbols.map(symbol => ({
            ...symbol,
            decoded: symbol.decode()
        }))

        if (decodedSymbols.length === 0) {
            return
        }

        await this.#videoCleanups()
        await this.#onScanSuccess(decodedSymbols[0].decoded, decodedSymbols[0].typeName.toLowerCase().replace('zbar_', ''))
    }

    async #videoCleanups() {
        this.#stream.getTracks().forEach(track => track.stop())
        this.#done = true
    }

    async #onScanSuccess(decodedText, decodedFormat) {
        this.model.serial = decodedText
        this.model.type = decodedFormat

        try {
            const card = await this.#cardsRepository.addCard(
                this.model.brand,
                '',
                this.model.type,
                this.model.serial
            )
        } finally {
            navigateToPageTag('home')
        }
    }

    #onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('select-card-brand')
    }
}