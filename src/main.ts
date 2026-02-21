import './scss/styles.scss';
import {Catalog} from './components/Models/Catalog';
import type {IApi, ICustomer, IProduct} from './types';
import {Api} from "./components/base/Api";
import {CommunicationAPI} from "./components/Communication/CommunicationAPI";
import {API_URL, CDN_URL} from "./utils/constants";
import {Customer} from "./components/Models/Customer.ts";
import {ShoppingCart} from "./components/Models/ShoppingCart.ts";
import {Gallery} from "./components/View/Gallery.ts";
import {cloneTemplate, ensureElement} from "./utils/utils.ts";
import {Header} from "./components/View/Header.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {Modal} from "./components/View/Modal.ts";
import {CardPreview} from "./components/View/cards/CardPreview.ts";
import {CardCatalog} from "./components/View/cards/CardCatalog.ts";
import {CardCompact} from "./components/View/cards/CardCompact.ts";
import {Cart} from "./components/View/Cart.ts";
import {OrderForm} from "./components/View/forms/OrderForm.ts";
import {ContactForm} from "./components/View/forms/ContactForm.ts";
import {IOrderRequest, IOrderResponse, TPayment} from "./types";
import {SuccessOrder} from "./components/View/SuccessOrder.ts";

const events = new EventEmitter();

events.onAll((event) => console.log(event))
// region Model
let modelCatalog = new Catalog(events);
let modelCustomer = new Customer();
let modelCart = new ShoppingCart(events);
// endregion

// region View
const viewHeader = new Header(ensureElement<HTMLElement>('.header'), events)
const viewGallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const viewModal = new Modal(ensureElement<HTMLElement>('.modal'), events);


const viewCardPreview = new CardPreview(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')), events);
const viewCart = new Cart(cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')), events)
const viewOrder = new OrderForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#order')), events)
const viewContacts = new ContactForm(cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')), events)
const viewSuccess = new SuccessOrder(cloneTemplate(ensureElement<HTMLTemplateElement>('#success')), events)
// endregion

// region Catalog
const apiInstance: IApi = new Api(API_URL);
const communication = new CommunicationAPI(apiInstance);
(async () => {
    try {
        const productsFromServer: IProduct[] = (await communication.fetchProducts()).map((item) => {
            item.image = `${CDN_URL}/${item.image}`
            return item
        });
        modelCatalog.setProducts(productsFromServer);
    } catch (error) {
        console.error('Ошибка:', error);
    }
})();
events.on('catalog:changed', () => {
    const allCards = modelCatalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')), {
            onClick: () => events.emit('card:select', item)
        });

        return card.render(item);
    });

    viewGallery.render({catalog: allCards});
});

events.on('card:select', (item: IProduct) => {
    modelCatalog.setSelectedProduct(item)
    const inCart = modelCart.hasItem(item.id);
    let text = '';
    if (item.price == null) {
        text = 'Недоступно'
    } else {
        text = inCart ? 'Удалить из корзины' : 'В корзину'
    }
    const itemWithTextButton = {
        ...item,
        buttonText: text,
    };
    viewModal.content = viewCardPreview.render(itemWithTextButton);
});

events.on('cart:add', () => {
    console.log('cart:add')
    const selectedProduct = modelCatalog.getSelectedProduct()
    if (selectedProduct === null) {
        throw new Error(`Unknown add product`);
    }
    modelCart.addItem(selectedProduct)
    modelCatalog.setSelectedProduct(null)
    events.emit('modal:close')
})
// endregion

events.on('modal:close', () => {
    viewModal.close()
})

// region Cart
events.on('cart:open', () => {
    events.emit('cart:changed');
    viewModal.content = viewCart.render();
})

events.on('cart:changed', () => {
    const products = modelCart.getItems();
    const isEmptyCart = products.length === 0;
    viewCart.acceptButtonState = isEmptyCart;
    if (!isEmptyCart) {
        viewCart.cartItems = products.map((product, index) => {
            const item = new CardCompact(cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')), {
                onDelete: () => events.emit('cart:remove_item', item)
            })
            const itemData = {
                ...product,
                index: index + 1,
            };
            return item.render(itemData)
        });
        viewCart.price = modelCart.getTotalCost()
    } else {
        viewCart.clear()
    }

    viewHeader.counter = modelCart.getCount()

})
// endregion

events.on('cart:remove_item', (item: IProduct) => {
    modelCart.removeItem(item)
})

// region OrderForms
events.on('cart:order', () => {
    console.log('cart:order')
    viewModal.content = viewOrder.render()
    console.log(viewOrder.render())
})

events.on('formOrder:Submit', ()=>{
    viewModal.content = viewContacts.render();
})


events.on('form:change', (data: { field: keyof ICustomer; value: string }) => {
    modelCustomer.setData({ [data.field]: data.value });
    const validation = modelCustomer.validate();

    const validateOrder = () => {
        const errors = validation.errors.address || validation.errors.payment || null
        viewOrder.errors = errors;
        viewOrder.submitButtonState = errors !== null;
    }

    const validateContacts = () => {
        const errors = validation.errors.email || validation.errors.phone || null
        viewContacts.errors = errors;
        viewContacts.submitButtonState = errors !== null;
    }

    switch (data.field) {
        case "payment":
            viewOrder.payment = data.value as TPayment ?? '';
            validateOrder()
            break
        case "address":
            viewOrder.address = data.value;
            validateOrder();
            break
        case "email":
            viewContacts.email = data.value;
            validateContacts()
            break
        case "phone":
            viewContacts.phone = data.value;
            validateContacts()
            break
    }
});
events.on('formContacts:submit', async ()=>{
    console.log('formContacts:submit')
    try {
        const buyerInfo = modelCustomer.getData();
        const items = modelCart.getItems().map((item) => item.id);
        const total = modelCart.getTotalCost();
        const orderData: IOrderRequest = {
            ...buyerInfo,
            total,
            items,
        };
        const response: IOrderResponse = await communication.sendOrder(orderData);//Отправляем заказ

        viewSuccess.cost = response.total;
        viewModal.content = viewSuccess.render();

    } catch (error) {
        console.error('Ошибка при отправке заказа:', error);
    }

})

events.on('successOrder:close', () => {
    console.log('successOrder:close')
    modelCart.clear();
    modelCustomer.clear()
    viewContacts.clear();
    viewOrder.clear()
    viewModal.close()

})
//endregion