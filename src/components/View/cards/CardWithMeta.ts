import {categoryMap} from "../../../utils/constants.ts";
import {Card, ICardData} from "./Card.ts";
import {ensureElement} from "../../../utils/utils.ts";

type CategoryKey = keyof typeof categoryMap;

export abstract class CardWithMeta<T extends ICardData> extends Card<T> {
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    protected constructor(container: HTMLElement) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    }

    set image(src: string | undefined) {
        if (src) {
            this.setImage(this.imageElement, src);
        }
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        // Удаляем те, которые могли быть добавлены ранее
        Object.values(categoryMap).forEach((cls) => {
            this.categoryElement.classList.remove(cls);
        });
        // Добавляем необходимую
        const cls = categoryMap[value as CategoryKey]
        if (cls) {
            this.categoryElement.classList.add()
        }
    }
}
