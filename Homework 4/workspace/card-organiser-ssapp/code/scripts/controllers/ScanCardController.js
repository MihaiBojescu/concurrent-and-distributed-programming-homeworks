const { navigateToPageTag } = WebCardinal.preload;
const { Controller } = WebCardinal.controllers;

export default class ScanCardController extends Controller {
    #qrScanner = void 0

    constructor(...props) {
        super(...props);

        this.model = {
            type: '',
            serial: '',
        }

        this.#qrScanner = new Html5Qrcode("reader")
        this.#onInit()
        this.onTagClick('go-back', this.onGoBack.bind(this))
    }

    async #onInit() {
        try {
            const devices = await Html5Qrcode.getCameras()
            const cameraId = devices[0]?.id

            this.#qrScanner.start(
                cameraId,
                { fps: 10 },
                this.onScanSuccess.bind(this),
                this.onScanFailed.bind(this)
            )
        } catch (error) {
            console.error(error)
        }
    }

    async onScanSuccess(decodedText, decodedResult) {
        this.model.scannerVisible = false
        this.model.serial = decodedText
        
        this.model.type = decodedResult.result.format.formatDescription
        this.#qrScanner.stop()
    }

    async onScanFailed(error) {}

    async onGoBack(model, target, event) {
        event.stopImmediatePropagation()
    
        try {
            if (this.#qrScanner.isScanning) {
                this.#qrScanner.stop()
            }
        } catch {}
    
        navigateToPageTag('select-card-brand')
    }
}
