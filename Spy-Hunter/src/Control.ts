import { keymap } from "./config"


export default class Control {
    result: String | undefined;

    constructor() {
        this.handleEvents()
    }

    findAction = (event: KeyboardEvent) => {
        let action = undefined;
        keymap.forEach(key => {
            if (key.keys.includes(event.key)) {
                action = key.action
            }
        });
        return action;
    }


    handleEvents() {

        window.addEventListener('keydown', event => { //if buttons are pressed

            console.log(this.findAction(event))

        })
        window.addEventListener('keyup', event => {//if buttons are released


        })
    }

}