import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

interface ICart {
    cartItems: HTMLElement[];
    price: number;
}

export class Cart extends Component<ICart> {
    protected listElement: HTMLElement
    protected acceptButton: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, event: IEvents) {
        super(container);
        this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.acceptButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.acceptButton.addEventListener('click', () => {
            event.emit('cart:order')
        })
        this.acceptButton.disabled = false;
    }

    set cartItems(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value)
    }

    set price(value: number) {
        this.priceElement.textContent = `${value} синапсов`
    }

    set acceptButtonState(value: boolean) {
        this.acceptButton.disabled = value;
    }

    clear() {
        this.listElement.innerHTML = '';
    }

}