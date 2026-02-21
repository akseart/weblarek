import type {IProduct} from '../../types';
import {EventEmitter} from "../base/Events.ts";

class Catalog {
    constructor(protected events: EventEmitter) {

    }
    private products: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed')
    }

    getProducts(): IProduct[] {
        return this.products;
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(p => p.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}

export {Catalog};
