import './scss/styles.scss';
import {Catalog} from './components/Models/Catalog';
import {ShoppingCart} from './components/Models/ShoppingCart';
import {Customer} from './components/Models/Customer';
import type {IApi, IProduct, TPayment} from './types';
import {apiProducts} from './utils/data';
import {Api} from "./components/base/Api";
import {CommunicationAPI} from "./components/Communication/CommunicationAPI";
import {API_URL} from "./utils/constants";

console.log('--- ТЕСТ КАТАЛОГ ---');
const catalog: Catalog = new Catalog();

catalog.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', catalog.getProducts());

const testProductId: string | undefined = apiProducts.items[0]?.id;
if (testProductId) {
    console.log(
        `Товар по id=${testProductId}:`,
        catalog.getProductById(testProductId)
    );
} else {
    console.log(
        `Проблемы с тестовым каталогом`
    )
}

const productForDetails = apiProducts.items[1] ?? null;
catalog.setSelectedProduct(productForDetails);
console.log(
    'Товар для подробного отображения:',
    catalog.getSelectedProduct()
);


console.log('--- ТЕСТ КОРЗИНА ---');
const cart = new ShoppingCart();

if (apiProducts.items[0]) {
    cart.addItem(apiProducts.items[0]);
}
if (apiProducts.items[1]) {
    cart.addItem(apiProducts.items[1]);
}

console.log('Товары в корзине после добавления:', cart.getItems());
console.log('Количество товаров в корзине:', cart.getCount());
console.log('Стоимость всех товаров в корзине:', cart.getTotalCost());

if (testProductId) {
    console.log(
        `Товар id=${testProductId} в корзине?:`,
        cart.hasItem(testProductId)
    );
}

if (apiProducts.items[0]) {
    cart.removeItem(apiProducts.items[0]);
    console.log(
        'Товары в корзине после удаления первого товара:',
        cart.getItems()
    );
}

cart.clear();
console.log('Товары в корзине после очистки:', cart.getItems());
console.log('Количество товаров в корзине после очистки:', cart.getCount());
console.log('Стоимость всех товаров в корзине после очистки:', cart.getTotalCost());

console.log('--- ТЕСТ ПОКУПАТЕЛЬ ---');
const customer = new Customer();

customer.setData({address: 'Ленина дом 2'});
console.log('Данные покупателя после сохранения только адреса:', customer.getData());

customer.setData({phone: '79998887766'});
console.log('Данные покупателя после добавления телефона:', customer.getData());

const validationResultErr = customer.validate();
console.log('Результат валидации (не все поля заполнены):', validationResultErr);


customer.setData({
    address: 'Ленина дом 2',
    phone: '79998887766',
    email: 'test@example.com',
    payment: 'online' as TPayment
});
console.log('Данные покупателя:', customer.getData());

const validationResult = customer.validate();
console.log('Результат валидации (все поля заполнены):', validationResult);


customer.clear();
console.log('Данные покупателя после очистки:', customer.getData());

const validationResultEmpty = customer.validate();
console.log('Результат валидации (пустые данные):', validationResultEmpty);


console.log('--- ТЕСТ СЛОЙ КОММУНИКАЦИИ ---');
const apiInstance: IApi = new Api(API_URL);

const communication = new CommunicationAPI(apiInstance);

const serverCatalog = new Catalog();

(async () => {
    try {
        const productsFromServer: IProduct[] = await communication.fetchProducts();

        serverCatalog.setProducts(productsFromServer);
        console.log('Каталог:', serverCatalog.getProducts());
    } catch (error) {
        console.error('Ошибка:', error);
    }
})();