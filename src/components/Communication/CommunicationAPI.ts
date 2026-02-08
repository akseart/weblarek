import type {IApi, IOrderRequest, IProduct, IProductsResponse} from '../../types';
import {IOrderResponse} from "../../types";

class CommunicationAPI {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async fetchProducts(): Promise<IProduct[]> {
        const data = await this.api.get<IProductsResponse>('/product/');
        return data.items;
    }

    async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return await this.api.post<IOrderResponse>('/order/', order);
    }

}

export {CommunicationAPI};