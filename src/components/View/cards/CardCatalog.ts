import {IProduct} from "../../../types";
import {CardWithMeta} from "./CardWithMeta.ts";
import {ICardActions} from "./Card.ts";


type TCardCatalog = Pick<IProduct, 'category'| 'image'>


export class CardCatalog extends CardWithMeta<TCardCatalog>{
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        if(actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
}