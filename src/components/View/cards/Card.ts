import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";
import {IProduct} from "../../../types";

export type ICardData = Partial<IProduct>

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onDelete?: (event: MouseEvent) => void;
}

export abstract class Card<T extends ICardData> extends Component<T>{

    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container)
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container)
    }

    set price(value: number | null){
        this.priceElement.textContent = value === null? `${value} синапсов` : "Бесценно";
    }

    set  title (value: string) {
        this.titleElement.textContent = value;
    }
}
