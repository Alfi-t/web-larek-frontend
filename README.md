# Проектная работа "Веб-ларек"

## Описание проекта 

Web-ларек - Интернет-магазин для веб-разработчиков. В нем можно:

- Просматривать каталог товаров
- Добавлять товары в корзину и оформлять  заказ
- Выбирать способ оплаты и вводить данные для доставки

## Используемый стек:
HTML, SCSS, TS, Webpack

## Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

## Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура проекта
Архитектура проекта построена по паттерну **MVP (Model-View-Presenter)** , что обеспечивает четкое разделение ответственности между 
классами слоя Model и View , где каждый класс выполняет свою роль.

Model - хранит и обрабатывает данные, полученные от пользователя или сервера.

View - отображает интерфейс для взаимодействия с пользователем, отлавливает и сообщает о произошедших событиях.

Presenter - представлен корневым файлом index.ts, где инстанцируются нужные для работы приложения классы и обеспечивается взаимодействие между слоями.

EventEmitter - сервисный класс, который используется для организации взаимодействия между классами слоя VIEW и слоя MODEL в презентере.

### Базовые классы

### Класс Api

**Свойства:**
- `readonly baseUrl: string` — базовый URL API.
- `protected options: RequestInit` — настройки запросов.

**Конструктор:**
constructor(baseUrl: string, options: RequestInit = {})

**Методы:**
- `protected handleResponse(response: Response): Promise<object>` — обработчик ответа сервера.
- `get(uri: string)` — выполняет GET-запрос по указанному URI.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` — отправляет данные методом POST, PUT или DELETE.

### Класс EventEmitter

Отвечает за обмен событиями между компонентами.

**Свойства:**

- `Events: Map<EventName, Set<Subscriber>>` — хранит события и соответствующих им подписчиков.

**Методы:**
- `on(event: string, listener: Function)` — добавляет обработчик события.
- `off(event: string, listener: Function)` — удаляет обработчик события.
- `emit(event: string, ...args: any[])` — инициирует событие с данными.
- `onAll(listener: Function)` — подписывается на все события.
- `offAll()` — сбрасывает всех подписчиков.

### Класс Component

Базовый абстрактный класс для всех классов слоя VIEW.

**Свойства:**

- `container: HTMLElement` — HTML-элемент для рендера.
- `props: T` — параметры компонента.

**Конструктор:**
protected constructor(protected readonly container: HTMLElement)

**Методы:**

- `render(data?: Partial<T>): HTMLElement` — возвращает корневой DOM-элемент.
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключает класс.
- `setText(element: HTMLElement, value: unknown)` — устанавливает текст.
- `setImage(element: HTMLImageElement, src: string, alt?: string)` — устанавливает изображение.
- `setDisabled(element: HTMLElement, state: boolean)` — устанавливает или убирает атрибут disabled у элемента в зависимости от состояния state.
- `setHidden(element: HTMLElement)` — скрывает элемент.
- `setVisible(element: HTMLElement)` — делает элемент видимым.

### Класс LarekApi
Предназначен для передачи и получения данных от сервера. Не относится к классу слоя MODEL, но используется как сервисный класс.

**Свойства:**
- `cdn: string` — строка, содержащая URL для CDN.
- `items: IProductItem[]` — массив товаров (карточек), загруженных с сервера.

**Методы:**

- `getListProducts(): Promise<IProductItem[]>` — получает список карточек товаров с сервера.
- `postOrderLot(order: IOrderLot): Promise<IOrderResult>` — отправляет данные заказа и получает подтверждение.

### Классы Model

#### Класс BasketModel
Хранит и работает с данными, полученными от пользователя.

**Свойства:**

- `basketProducts: IProductItem[]` — список товаров в корзине.
- `eventEmitter: EventEmitter` — экземпляр класса для обработки событий.

**Методы:**

- `set basketProducts(data: IProductItem[]) `— устанавливает список товаров в корзине.
- `get basketProducts()` — возвращает текущий список товаров в корзине.
- `getCounter(): number` — возвращает количество товаров в корзине.
- `getSumAllProducts(): number ` — возвращает общую сумму всех товаров в корзине.
- `addToBasket(data: IProductItem): void` — добавляет товар в корзину, если его нет в корзине.
- `isProductInBasket(product: IProductItem): boolean` — проверяет, есть ли товар в корзине.
- `deleteProductFromBasket(item: IProductItem): void` — удаляет товар из корзины.
- `clearBasketProducts(): void` — очищает корзину и отправляет событие об изменении.

#### Класс DataModel
Хранит данные продуктов, полученные с сервера.

**Свойства:**

- `products: IProductItem[]` — список товаров.
- `selectedCard: IProductItem | null` — выбранная карточка товара.
- `Events: IEvents` — экземпляр для работы с событиями.

**Методы:**

- `set products(data: IProductItem[])` — устанавливает список продуктов.
- `get products()` — возвращает текущий список продуктов.
- `setPreview(item: IProductItem)` — устанавливает выбранный товар.
- `get selectedCard()` — возвращает текущий выбранный товар.

**Конструктор:**

constructor(protected Events: IEvents)

#### Класс FormModel
Хранит данные, введенные пользователем в форму.

**Свойства:**

-`payment: string` — метод оплаты.
- `email: string` — адрес электронной почты.
- `phone: string` — номер телефона.
- `address: string` — адрес доставки.
- `total: number` — общая сумма заказа.
- `items: string[]` — список идентификаторов товаров в заказе.
- `formErrors: FormErrors` — объект для хранения ошибок валидации.

**Методы:**

- `setOrderAddress(address: string): void` — Устанавливает адрес заказа и выполняет валидацию. Если валидация успешна, эмитирует событие order:ready с данными заказа.
- `validateOrder(): boolean` — проверяет введённые данные.
- `setOrderData(field: string, value: string): void` — Устанавливает значение для указанного поля (email, phone, address), выполняет валидацию и эмитирует событие.
- `setEmail(email: string): void` — Устанавливает email и выполняет валидацию.
- `setPhone(phone: string): void` — Устанавливает номер телефона, форматирует его при необходимости, валидирует и эмитирует событие при успешной проверке.
- `validateContacts(): boolean` — проверяет корректность данных.
- `getOrderLot(): object` — возвращает объект с данными заказа (payment, email, phone, address, total, items).
- `clearForm(): void` — очищает все данные формы, включая ошибки.

### Классы View
Позволяют отображать элементы страницы с полученными данными и взаимодействовать с пользователем.

#### Класс Basket
Управляет отображением корзины.

**Свойства:**
- `basket: HTMLElement` — контейнер для корзины.
- `title: HTMLElement` — заголовок корзины.
- `basketList: HTMLElement` — список товаров в корзине.
- `button: HTMLButtonElement` — кнопка для открытия корзины.
- `basketPrice: HTMLElement` — элемент для отображения общей стоимости товаров.
- `headerBasketButton: HTMLButtonElement` — кнопка в шапке для открытия корзины.
- `headerBasketCounter: HTMLElement` — счётчик количества товаров в корзине.
- `items: HTMLElement[]` — массив элементов товаров в корзине.

**Методы:**

- `set items(items: HTMLElement[]): void` — Устанавливает элементы списка товаров.
- `renderSumAllProducts(sumAll: number): void` — отображает общую стоимость товаров в корзине.
- `render(items: HTMLElement[], total: number): HTMLElement` — рендерит корзину с товарами и суммой, возвращает элемент корзины.
- `update(items: HTMLElement[], total: number): void` — обновляет содержимое корзины и общую стоимость.

#### Класс BasketItem
Управляет отображением элементов (продуктов) в корзине.

**Свойства:**
- `basketItem: HTMLElement` — контейнер для элемента товара в корзине.
- `index: HTMLElement` — элемент для отображения индекса товара в корзине.
- `title: HTMLElement` — элемент для отображения названия товара.
- `price: HTMLElement` — элемент для отображения цены товара.
- `buttonDelete: HTMLButtonElement` — кнопка для удаления товара из корзины.

**Метод:**
- `render(data: IProductItem, item: number): HTMLElement` — рендерит элемент товара с данными (data) и индексом товара (item), возвращает элемент basketItem.
- `setPrice(value: number | null): string` — устанавливает цену товара.

### Класс Card
Управляет отображением карточки товара.

**Свойства:**
- `cardElement: HTMLElement` — основной контейнер для карточки товара.
- `cardCategory: HTMLElement` — элемент для отображения категории товара.
- `cardTitle: HTMLElement` — элемент для отображения названия товара.
- `cardImage: HTMLImageElement` — элемент для отображения изображения товара.
- `cardPrice: HTMLElement` — элемент для отображения цены товара.

**Методы:**

- `set cardCategory(value: string)` — устанавливает категорию товара.
- `render(data: IProductItem): HTMLElement` — рендерит карточку товара.
- `setText(element: HTMLElement, value: unknown): string` — устанавливает текст.
- `setPrice(value: number | null): string` — Форматирует цену товара.

#### Класс CardPreview
Расширяет функциональность Card для отображения подробной информации о товаре.

**Свойства:**

- `text: HTMLElement` — элемент для отображения описания товара.
- `button: HTMLElement` — кнопка, с помощью которой добавляется товар в корзину.

**Методы:**

- `notSale(data: IProductItem): string` — Определяет текст кнопки и её состояние.
- `render(data: IProductItem): HTMLElement` — рендерит карточку товара.

### Класс FormContacts
Управляет отображением содержимого модального окна и позволяет принять от пользователя номер телефона и Email.

**Свойства:**
- `formContacts: HTMLFormElement` — форма для контактов.
- `inputAll: HTMLInputElement[]` — список всех полей ввода в форме.
- `buttonSubmit: HTMLButtonElement` — кнопка отправки формы.
- `formErrors: HTMLElement` — блок для вывода ошибок в форме.

**Методы:**
- `validateForm(): void` — Проверяет валидность каждого поля ввода.
- `isValid(): boolean` — Возвращает true, если все поля ввода валидны, иначе — false.
- `displayErrors(): void` — Отображает сообщение об ошибках в элементе formErrors.
- `clearForm(): void` — Очищает все поля формы.
- `set valid(value: boolean)` — Управляет состоянием кнопки отправки (disabled).
- `render(): HTMLElement` — Возвращает HTML-элемент формы для отображения на странице.

### Класс FormOrder
Отвечает за взаимодействие с формой оформления заказа.

**Свойства:**
- `formOrder: HTMLFormElement` — форма для заказа.
- `buttonAll: HTMLButtonElement[]` — список всех кнопок.
- `buttonSubmit: HTMLButtonElement` — кнопка отправки формы.
- `formErrors: HTMLElement` — блок для вывода ошибок в форме.
- `paymentSelection: string` — приватное свойство для хранения выбранного способа оплаты.
- `isAddressSelected: boolean` — Флаг, указывающий, выбран ли адрес.

**Методы:**
- `get paymentSelection()` — Возвращает текущий выбранный способ оплаты.
- `set paymentSelection(payment: string)` — Устанавливает выбранный способ оплаты и обновляет классы кнопок.
- `checkFormValidity(): void` — Проверяет валидность формы.
- `render(): HTMLElement` — Возвращает HTML-элемент формы для отображения на странице.
- `set valid(value: boolean)` — Управляет состоянием кнопки отправки


#### Класс Modal
Управляет отображением модальных окон.

**Свойства:**
- `modalContainer: HTMLElement` — контейнер модального окна.
- `closeButton: HTMLButtonElement` — кнопка для закрытия модального окна.
- `content: HTMLElement` — контент модального окна.
- `pageWrapper: HTMLElement` — обертка всей страницы, которая используется для блокировки страницы при открытии модального окна.

**Методы:**

- `open()` — открывает модальное окно.
- `close()` — закрывает модальное окно.
- `set locked(value: boolean)` — сеттер для блокировки страницы при открытии модального окна.
- `set content(value: HTMLElement)` — сеттер для установки содержимого модального окна.
- `render()` — возвращает сам контейнер модального окна.

#### Класс Page
Управляет основными элементами страницы (каталог, корзина).

**Свойства:**

- `counter: HTMLElement` — элемент счётчика корзины.
- `catalog: HTMLElement` — элемент каталога товаров.
- `wrapper: HTMLElement` — обёртка страницы.
- `basket: HTMLElement` — элемент корзины.
- `Events: IEvents` — Интерфейс для работы с событиями.

**Методы:**

- `set counter(value: number)` — обновляет текст счётчика.
- `set catalog(items: HTMLElement[])` — заменяет содержимое каталога.
- `set locked(value: boolean)` — Устанавливает блокировку страницы.

**Конструктор:**

constructor(container: HTMLElement, Events: IEvents)

#### Класс Success
Используется для отобажения модального окна с сообщением о том, что операция прошла успешно.

**Свойства:**

- `success: HTMLElement` — основной контейнер для успешного сообщения.
- `description: HTMLElement` — элемент, в котором отображается описание успешной операции.
- `button: HTMLButtonElement` — кнопка для закрытия сообщения.
- `Events: IEvents` — Событийная система для обработки событий.

**Методы:**

- `render(total: number): HTMLElement` — Обновляет текст в элементе description и возвращает корневой элемент компонента success.

## Список событий в приложении

- `products:receive` – Получение списка товаров с сервера.
- `card:select` – Клик по карточке товара для отображения предварительного просмотра.
- `modalCard:open` – Открытие модального окна с подробным просмотром товара.
- `card:addBasket` – Добавление товара в корзину.
- `basket:open` – Открытие модального окна корзины.
- `basket:basketItemRemove` – Удаление товара из корзины.
- `order:open` – Открытие модального окна с формой оформления заказа.
- `order:paymentSelection` – Выбор способа оплаты.
- `order:changeAddress` – Изменение адреса доставки.
- `formErrors:address` – Валидация поля "адрес".
- `contacts:open` – Открытие модального окна с формой для ввода контактных данных.
- `contacts:changeInput` – Изменение данных в полях "Email" и "Телефон".
- `formErrors:change` – Валидация полей "Email" и "Телефон".
- `success:open` – Открытие модального окна "Заказ оформлен" после успешного оформления заказа.
- `success:close` – Закрытие модального окна "Заказ оформлен".
- `modal:open` – Открытие модального окна (блокировка прокрутки страницы).
- `modal:close` – Закрытие модального окна (разблокировка прокрутки страницы).