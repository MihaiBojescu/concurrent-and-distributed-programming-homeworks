import { cardsRepositoryInstance } from "../repository/CardsRepository.js";

const { Controller } = WebCardinal.controllers;

export default class HomeController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            state: 'loading'
        }

        this.cardsRepository = cardsRepositoryInstance.get()
        this.cardsRepository.then(() => {
            this.model.state = 'loaded'
        }).catch((err) => {
            console.log(err)
            this.model.state = 'error'
        })
    }
}
