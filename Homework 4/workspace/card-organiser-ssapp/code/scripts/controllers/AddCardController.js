import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class AddCardController extends Controller {
    #cardsRepository = void 0
    #qrScanner = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading',
            brand: '',
            description: '',
            type: '',
            serial: '',
            brands: [
                { value: 'unknown' },
                { value: 'auchan' },
            ],
            scannerVisible: false,
        }

        this.#cardsRepository = cardsRepositoryInstance.get()
        this.#qrScanner = new Html5Qrcode("reader")
        this.#cardsRepository
            .then(() => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error: null } })))
            .catch((error) => document.dispatchEvent(new CustomEvent('add-card-controller-loaded', { detail: { error } })))

        document.addEventListener('add-card-controller-loaded', this.#onInit.bind(this))
    }

    async #onInit(event) {
        if (event.error) {
            console.error(err)
            this.model.state = 'error'
            return
        }

        this.#cardsRepository = await this.#cardsRepository
        this.model.state = 'loaded'
        this.onTagClick('add-card', this.#onAddCard.bind(this))
        this.onTagClick('scan-serial', this.#onScanSerial.bind(this))
        this.onTagClick('go-back', this.#onGoBack.bind(this))
    }

    async #onAddCard(model, target, event) {
        event.stopImmediatePropagation()

        if (this.model.state !== 'loaded') {
            return
        }

        this.model.brand = document.querySelector('.brand')?.value

        await this.#cardsRepository.addCard(
            this.model.brand,
            this.model.description,
            this.model.type,
            this.model.serial
        )
        
        navigateToPageTag('home')
    }

    async #onScanSerial(model, target, event) {
        event.stopImmediatePropagation()

        const devices = await Html5Qrcode.getCameras()
        const cameraId = devices[0]?.id
        
        let triggered = false
        const observer = new MutationObserver((mutations, observer) => {
            for (const mutation of mutations) {
                if (!mutation.addedNodes[0]?.classList?.contains('page-cover')) {
                    continue
                }
                
                observer.disconnect()

                if (triggered) {
                    return
                }

                triggered = true
                this.#qrScanner.start(
                    cameraId,
                    { fps: 10 },
                    this.#onScanSuccess.bind(this),
                    this.#onScanFailed.bind(this)
                )
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
     
        this.model.scannerVisible = true
    }

    async #onGoBack(model, target, event) {
        event.stopImmediatePropagation()
        navigateToPageTag('home')
    }

    async #onScanSuccess(decodedText, decodedResult) {
        this.model.scannerVisible = false
        this.model.serial = decodedText
        
        this.model.type = decodedResult.result.format.formatDescription
        this.#qrScanner.stop()
    }

    async onDisconnectedCallback() {
        console.log('disconnected')
    }
}
