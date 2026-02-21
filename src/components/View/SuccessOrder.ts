import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

interface ISuccessOrder{
    cost: number;
}

export class SuccessOrder extends Component<ISuccessOrder>{
    protected descriptionElement: HTMLElement;
    protected closeButton: HTMLButtonElement;
    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container)
        this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

        this.closeButton.addEventListener('click', () => {
            events.emit('successOrder:close')
        })
    }

    set cost(value: number) {
        this.descriptionElement.textContent = `Списано ${value} синапсов`
    }
}