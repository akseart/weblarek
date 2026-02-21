import {Component} from "../../base/Component.ts";
import {IEvents} from "../../base/Events.ts";
import {ensureElement} from "../../../utils/utils.ts";
import {ICustomer} from "../../../types";

interface IBaseForm {
    errors: string | null;
    submitButtonState: boolean;
}
export abstract class BaseForm<IBaseForm> extends Component<IBaseForm>{
    protected errorsElement: HTMLElement;
    protected submitButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    }

    set errors (value: string | null){
        this.errorsElement.textContent = value || '';
    }

    set submitButtonState (value: boolean){
        this.submitButton.disabled = value;
    }

    protected onFormChange(field: keyof ICustomer, value: string | null) {
        this.events.emit('form:change', {
            field,
            value,
        });
    }
}