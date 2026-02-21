import {BaseForm} from "./BaseForm.ts";
import {IEvents} from "../../base/Events.ts";
import {ensureElement} from "../../../utils/utils.ts";

interface IContactForm {
    email: string;
    phone: string;
}
export class ContactForm extends BaseForm<IContactForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.onFormChange('email', this.emailInput.value);
        });

        this.phoneInput.addEventListener('input', () => {
            this.onFormChange('phone', this.phoneInput.value)
        })

        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.events.emit('formContacts:submit');
        })

    }

    set email (value: string) {
        this.emailInput.value = value;
    }

    set phone (value: string) {
        this.phoneInput.value = value
    }

    clear() {
        this.phoneInput.value = '';
        this.emailInput.value = '';
    }
}