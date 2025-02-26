import './scss/styles.scss';
import { CDN_URL, API_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/Model/LarekApi';
import { DataModel } from './components/Model/DataModel';
import { Card } from './components/View/Card';
import { CardPreview } from './components/View/CardPreview';
import { IOrderForm, IProductItem } from './types';
import { Modal } from './components/View/Modal';
import { ensureElement } from './utils/utils';
import { BasketModel } from './components/Model/BasketModel';
import { Basket } from './components/View/Basket';
import { BasketItem } from './components/View/BasketItem';
import { FormModel } from './components/Model/FormModel';
import { Order } from './components/View/FormOrder';
import { Contacts } from './components/View/FormContacts';
import { Success } from './components/View/Success';
import { PageView } from './components/View/Page';

const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const successTemplate = ensureElement('#success') as HTMLTemplateElement;

const larekApiInstance = new LarekApi(CDN_URL, API_URL, {});
const events = new EventEmitter();
const dataModel = new DataModel(events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(basketTemplate, events);
const basketModel = new BasketModel(events);
const formModel = new FormModel(events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const page = new PageView(ensureElement('.page'), events);

// Отображение карточек товара на странице
events.on('products:receive', () => {
  const catalogItems = dataModel.products.map(item => {
    const card = new Card(cardCatalogTemplate, events, {
      onClick: () => events.emit("card:select", item)
    });
    return card.render(item);
  });

  page.catalog = catalogItems;
});

// Получить объект данных "IProductItem" карточки, по которой кликнули
events.on('card:select', (item: IProductItem) => {
  dataModel.setPreview(item);
});

// Открываем модальное окно карточки товара
events.on('modalCard:open', (item: IProductItem) => {
  const cardPreview = new CardPreview(cardPreviewTemplate, events);
  modal.content = cardPreview.render(item);
  modal.render();
});

// Добавление товара в корзину
events.on('card:addBasket', () => {
  if (basketModel.isProductInBasket(dataModel.selectedCard)) {
    // Если товар уже в корзине, блокируем кнопку
    const buyButton = document.querySelector('.buy-button'); // Подставьте правильный селектор
    if (buyButton) buyButton.setAttribute('disabled', 'true');
    return; // Не добавляем товар в корзину
  }
  
  basketModel.addToBasket(dataModel.selectedCard); // добавить карточку товара в корзину
  page.counter = basketModel.getCounter();
  modal.close();

  // Разблокируем кнопку, если товар был удален из корзины
  const buyButton = document.querySelector('.buy-button');
  if (buyButton) buyButton.removeAttribute('disabled');
});

// Открытие модального окна корзины
events.on('basket:open', () => {
  const basketItems = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { 
      onClick: () => events.emit('basket:basketItemRemove', item) 
    });
    return basketItem.render(item, index + 1);
  });

  const totalSum = basketModel.getSumAllProducts();
  modal.content = basket.render(basketItems, totalSum); // Передача элементов и общей суммы
  modal.render();
});

// Удаление карточки товара из корзины
events.on('basket:basketItemRemove', (item: IProductItem) => {
  basketModel.deleteProductFromBasket(item);

   // Проверяем, нужно ли блокировать кнопку или разблокировать
   const buyButton = document.querySelector('.buy-button');
   if (buyButton && basketModel.getCounter() === 0) {
     buyButton.removeAttribute('disabled'); // Разблокировать, если корзина пуста
   }
   
  const basketItems = basketModel.basketProducts.map((item, index) => {
    const basketItem = new BasketItem(cardBasketTemplate, events, { 
      onClick: () => events.emit('basket:basketItemRemove', item) 
    });
    return basketItem.render(item, index + 1);
  });

  const totalSum = basketModel.getSumAllProducts();
  modal.content = basket.render(basketItems, totalSum); // Передача обновленных данных
  page.counter = basketModel.getCounter();
  modal.render();
});

/********** Открытие модального окна "способа оплаты" и "адреса доставки" **********/
events.on('order:open', () => {
  modal.content = order.render();
  modal.render();
  formModel.items = basketModel.basketProducts.map(item => item.id); // передаём список id товаров которые покупаем
});

events.on('order:paymentSelection', (button: HTMLButtonElement) => { formModel.payment = button.name }) // передаём способ оплаты

/********** Отслеживаем изменение в поле в вода "адреса доставки" **********/
events.on(`order:changeAddress`, (data: { field: string, value: string }) => {
  formModel.setOrderAddress(data.value); // Передаем `value` как адрес
});

/********** Валидация данных строки "address" и payment **********/
events.on('formErrors:address', (errors: Partial<IOrderForm>) => {
  const { address, payment } = errors;
  order.valid = !address && !payment;
  order.formErrors.textContent = Object.values({address, payment}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Email" и "Телефон" **********/
events.on('contacts:open', () => {
  formModel.total = basketModel.getSumAllProducts();
  modal.content = contacts.render();
  modal.render();
});

/********** Отслеживаем изменение в полях вода "Email" и "Телефон" **********/
events.on(`contacts:changeInput`, (data: { field: string, value: string }) => {
  formModel.setOrderData(data.field, data.value);
});

/********** Валидация данных строки "Email" и "Телефон" **********/
events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
  const { email, phone } = errors;
  contacts.valid = !email && !phone;
  contacts.formErrors.textContent = Object.values({phone, email}).filter(i => !!i).join('; ');
})

/********** Открытие модального окна "Заказ оформлен" **********/
events.on('success:open', () => {
    larekApiInstance.postOrderLot(formModel.getOrderLot())
    .then(() => {
      const success = new Success(successTemplate, events);
      modal.content = success.render(basketModel.getSumAllProducts());
      basketModel.clearBasketProducts(); // очищаем корзину
      page.counter = basketModel.getCounter();
      formModel.clearForm(); // Очищаем форму
      modal.render();
    })
    .catch(error => console.log(error));
});

events.on('success:close', () => modal.close());

/********** Блокировка и разблокировка прокрутки страницы **********/
events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

/********** Получаем данные с сервера **********/
larekApiInstance.getListProducts()
.then((data: IProductItem[]) => {
  dataModel.products = data;
})
.catch(error => console.log(error));