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
- `handleResponse(response: Response): Promise<object>` — обработчик ответа сервера.
- `get(uri: string)` — выполняет GET-запрос по указанному URI.
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` — отправляет данные методом POST, PUT или DELETE.

### Класс EventEmitter

Отвечает за обмен событиями между компонентами.

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

### Класс LarekApi
Предназначен для передачи и получения данных от сервера. Не относится к классу слоя MODEL, но используется как сервисный класс.

**Свойства:**
- `cdn: string` — строка, содержащая URL для CDN.
- `items: IProductItem[]` — массив товаров (карточек), загруженных с сервера.

**Методы:**

- `getListProductCard()` — получает список карточек товаров с сервера.
- `postOrderLot(data: object)` — отправляет данные заказа и получает подтверждение.

### Классы Model

#### Класс BasketModel
Хранит и работает с данными, полученными от пользователя.

**Методы:**

- `set basketProducts(data: IProductItem[]) `— устанавливает список товаров в корзине.
- `get basketProducts()` — возвращает текущий список товаров в корзине.
- `getCounter()` — возвращает количество товаров в корзине.
- `getSumAllProducts()` — возвращает общую сумму всех товаров в корзине.
- `addToBasket(data: IProductItem)` — добавляет товар в корзину.
- `deleteProductFromBasket(item: IProductItem)` — удаляет товар из корзины.
- `clearBasketProducts()` — очищает корзину.

#### Класс DataModel
Хранит данные продуктов, полученные с сервера.

**Свойства:**

- `items: Product[]` — список товаров.
- `total: number` — общая сумма товаров.
- `preview: Product | null` — данные для превью.

**Методы:**

- `set products(data: IProductItem[])` — устанавливает список продуктов.
- `get products()` — возвращает текущий список продуктов.
- `setPreview(item: IProductItem)` — устанавливает выбранный товар.
- `get selectedCard()` — возвращает текущий выбранный товар.

**Конструктор:**

constructor(protected Events: IEvents)

#### Класс FormModel
Хранит данные, введенные пользователем в форму.

**Методы:**

- `setOrderAddress(address: string)` — сохраняет адрес доставки.
- `validateOrder()` — проверяет введённые данные.
- `setOrderData(data: { phone: string, email: string })` — сохраняет контактные данные.
- `setEmail(email: string)` — сохраняет адрес электронной почты.
- `setPhone(phone: string)` — сохраняет номер телефона.
- `validateContacts()` — проверяет корректность данных.
- `getOrderLot()` — возвращает объект с данными заказа (payment, email, phone, address, total, items).
- `clearForm()` — очищает все данные формы, включая ошибки.

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

- `renderSumAllProducts(sumAll: number)` — отображает общую стоимость товаров в корзине.
- `render(items: HTMLElement[], total: number)` — рендерит корзину с товарами и суммой, возвращает элемент корзины.
- `update(items: HTMLElement[], total: number)` — обновляет содержимое корзины и счётчик товаров.

#### Класс BasketItem
Управляет отображением элементов (продуктов) в корзине.

**Свойства:**
- `basketItem: HTMLElement` — контейнер для элемента товара в корзине.
- `index: HTMLElement` — элемент для отображения индекса товара в корзине.
- `title: HTMLElement` — элемент для отображения названия товара.
- `price: HTMLElement` — элемент для отображения цены товара.
- `buttonDelete: HTMLButtonElement` — кнопка для удаления товара из корзины.

**Метод:**
- `render(data: IProductItem, item: number)` — рендерит элемент товара с данными (data) и индексом товара (item), возвращает элемент basketItem.
- `setPrice(price: number)` — устанавливает цену товара.

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
- `setText(element: HTMLElement, text: string)` — устанавливает текст.
- `setPrice(value: number | null): string` — отображает цену товара.

#### Класс CardPreview
Расширяет функциональность Card для отображения подробной информации о товаре.

**Свойства:**

- `text: HTMLElement` — элемент для отображения описания товара.
- `button: HTMLElement` — кнопка, с помощью которой добавляется товар в корзину.

**Методы:**

- `notSale()` — блокирует покупку товара без цены.
- `render(data: IProductItem): HTMLElement` — рендерит карточку товара.

### Класс FormContacts
Управляет отображением содержимого модального окна и позволяет принять от пользователя номер телефона и Email.

**Свойства:**
- `formContacts: HTMLFormElement` — форма для контактов.
- `inputAll: HTMLInputElement[]` — список всех полей ввода в форме.
- `buttonSubmit: HTMLButtonElement` — кнопка отправки формы.
- `formErrors: HTMLElement` — блок для вывода ошибок в форме.

**Метод:**
- `set valid(value: boolean)` — геттер и сеттер для состояния кнопки отправки формы.

### Класс FormOrder
Отвечает за взаимодействие с формой оформления заказа.

**Свойства:**
- `formOrder: HTMLFormElement` — форма для заказа.
- `buttonAll: HTMLButtonElement[]` — список всех кнопок.
- `buttonSubmit: HTMLButtonElement` — кнопка отправки формы.
- `formErrors: HTMLElement` — блок для вывода ошибок в форме.
- `paymentSelection: string` — приватное свойство для хранения выбранного способа оплаты.

**Метод:**
- `paymentSelection()` — выделяет выбранный способ оплаты.

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

#### Класс PageView
Управляет основными элементами страницы (каталог, корзина).

**Свойства:**

- `counter: HTMLElement` — элемент счётчика корзины.
- `catalog: HTMLElement` — элемент каталога товаров.
- `wrapper: HTMLElement` — обёртка страницы.
- `basket: HTMLElement` — элемент корзины.

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