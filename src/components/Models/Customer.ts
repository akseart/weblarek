import type {ICustomer, IValidationCustomerResult, TPayment} from '../../types';

class Customer {
    private payment: TPayment = null;
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    setData(data: Partial<ICustomer>): void {
        if (data.payment !== undefined) {
            this.payment = data.payment;
        }
        if (data.address !== undefined) {
            this.address = data.address;
        }
        if (data.phone !== undefined) {
            this.phone = data.phone;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
    }

    getData(): ICustomer {
        return {
            payment: this.payment,
            // Кажется, что здесь в таком случае не имеет смысла вообще проверка через ??
            address: this.address ?? '',
            phone: this.phone ?? '',
            email: this.email ?? ''
        };
    }

    clear(): void {
        this.payment = null;
        this.address = '';
        this.phone = '';
        this.email = '';
    }

    validate(): IValidationCustomerResult {
        const errors: IValidationCustomerResult['errors'] = {};

        if (!this.payment) {
            errors.payment = 'Поле "вид оплаты" не заполнено';
        }
        if (!this.address) {
            errors.address = 'Поле "адрес" не заполнено';
        }
        if (!this.phone) {
            errors.phone = 'Поле "телефон" не заполнено';
        }
        if (!this.email) {
            errors.email = 'Поле "email" не заполнено';
        }
        return {
            errors
        };
    }
}

export {Customer};
