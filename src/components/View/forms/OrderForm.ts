import {BaseForm} from "./BaseForm.ts";
import {IEvents} from "../../base/Events.ts";
import {ensureElement} from "../../../utils/utils.ts";

interface IOrderForm {
    address: string;
    payment: 'cash' | 'card' | '';
}

export class OrderForm extends BaseForm<IOrderForm> {

    protected addressElement: HTMLInputElement;
    protected cardPaymentButton: HTMLButtonElement;
    protected cashPaymentButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.addressElement = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.addressElement.addEventListener('input', () => {
            this.onFormChange('address', this.addressElement.value)
        })
        this.cardPaymentButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cardPaymentButton.addEventListener('click', () => {
            this.onFormChange('payment', 'card');
        });
        this.cashPaymentButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
        this.cashPaymentButton.addEventListener('click', () => {
            this.onFormChange('payment', 'cash');
        });
        this.submitButton.addEventListener('click', () => {
            events.emit('formOrder:Submit')
        })
    }

    set payment(method: 'card' | 'cash' | '') {
        this.cashPaymentButton.classList.toggle('button_alt-active', method === 'cash');
        this.cardPaymentButton.classList.toggle('button_alt-active', method === 'card');
    }

    set address(value: string) {
        this.addressElement.value = value;
    }

    clear() {
        this.addressElement.value = '';
        this.cashPaymentButton.classList.remove('button_alt-active');
        this.cardPaymentButton.classList.remove('button_alt-active');
    }


}