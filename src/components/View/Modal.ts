import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

interface IModal{

}

export class Modal extends Component<IModal>{
    private contentElement: HTMLElement;
    private buttonClose: HTMLButtonElement;
    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
        this.buttonClose = ensureElement<HTMLButtonElement>('.modal__close', this.container)

        this.buttonClose.addEventListener('click', () => {
            this.events.emit('modal:close')
        })

        this.container.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target === this.container) {
                this.events.emit('modal:close');
            }
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
        this.container.classList.add('modal_active')
    }

    close(){
        this.container.classList.remove('modal_active')
    }
}