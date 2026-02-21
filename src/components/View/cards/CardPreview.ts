import {IProduct} from "../../../types";
import {ensureElement} from "../../../utils/utils.ts";
import {CardWithMeta} from "./CardWithMeta.ts";
import {EventEmitter} from "../../base/Events.ts";

export type TDataCardPreview = Pick<IProduct,'id' | 'image' | 'category' | 'description'>;

export class CardPreview extends CardWithMeta<TDataCardPreview> {
    protected descriptionElement: HTMLElement;
    protected addButtonElement: HTMLButtonElement;
    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.addButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.addButtonElement.addEventListener('click', ()=> {
            this.events.emit('cart:add')
        })
    }

    set description (value: string){
        this.descriptionElement.textContent = value;
    }

    set addButtonState (value: boolean){
        this.addButtonElement.disabled = value;
    }
}