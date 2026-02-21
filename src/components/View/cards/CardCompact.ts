import {Card, ICardActions, ICardData} from "./Card.ts";
import {ensureElement} from "../../../utils/utils.ts";


interface ICardCompactData extends ICardData {
    index: number;
}

export class CardCompact extends Card<ICardCompactData> {
    protected itemIndexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: ICardActions) {
        super(container);

        this.itemIndexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onDelete) {
            this.deleteButton.addEventListener('click', actions.onDelete);
        }


    }

    set index(value: number) {
        this.itemIndexElement.textContent = `${value}`
    }

}