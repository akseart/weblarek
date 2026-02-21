import {IProduct} from "../../types";
import {EventEmitter} from "../base/Events.ts";

class ShoppingCart {
    private items: IProduct[] = [];

    constructor(protected events: EventEmitter) {

    }

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(product: IProduct): void {
        this.items.push(product);
        this.events.emit('cart:changed')
    }

    removeItem(product: IProduct): void {
        this.items = this.items.filter(p => p.id !== product.id);
        this.events.emit('cart:changed')
    }

    clear(): void {
        this.items = [];
        this.events.emit('cart:changed')
    }

    getTotalCost(): number {
        return this.items.reduce(
            (sum, p) => sum + (p.price ?? 0),
            0
        );
    }

    getCount(): number {
        return this.items.length;
    }

    hasItem(id: string): boolean {
        return this.items.some(p => p.id === id);
    }
}

export {ShoppingCart};
