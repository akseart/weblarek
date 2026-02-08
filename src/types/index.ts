export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface ICustomer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IValidationCustomerResult {
    isValid: boolean;
    errors: {
        payment?: string;
        address?: string;
        phone?: string;
        email?: string;
    };
}

export interface IProductsResponse {
    items: IProduct[];
}

export interface IOrderRequest extends ICustomer {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}
