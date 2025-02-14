# Проектная работа "Веб-ларек"

## Описание проекта 

Web-ларек - Интернет-магазин для веб-разработчиков. В нем можно:

- Просмотривать каталог товаров
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

## Архитектура проекта

Архитектура проекта построена по паттерну **MVP (Model-View-Presenter)** , что обеспечивает четкое разделение ответственности между слоями и возможность переиспользования компонентов.

### Основные слои:

- **Model** - отвечает за управление данными приложения и взаимодействие с API.
- **View** - отвечает за отображение данных и пользовательский интерфейс.
- **Presenter** - связывает Model и View, обрабатывает пользовательские действия и управляет обновлением интерфейса.

Класс `EventEmitter` используется для передачи данных между слоями. View и Model взаимодействуют только через события, чтобы минимизировать взаимозависимость.

## Типы данных

### Основные интерфейсы

- `IProduct` - Данные товара
  - `id: string` - Уникальный идентификатор
  - `title: string` - Название товара
  - `price: number` - Цена товара
  - `description: string` - Описание товара
  - `image: string` - URL изображения товара

- `ICartItem` - Товар в корзине
  - `productId: string` - ID товара
  - `quantity: number` - Количество

- `IOrder` - Данные заказа
  - `id: string` - Уникальный идентификатор заказа
  - `items: ICartItem[]` - Список товаров
  - `total: number` - Общая сумма
  - `status: string` - Статус заказа
  - `deliveryAddress: string` - Адрес доставки
  - `paymentMethod: string` - Метод оплаты

- `IPaymentMethod` - Способ оплаты
  - `id: string` - Уникальный идентификатор
  - `type: string` - Тип оплаты (например, "карта", "наличные")
  - `details: string` - Дополнительные данные (например, номер карты)

- `IDeliveryData` - Данные о доставке
  - `name: string` - Имя получателя
  - `address: string` - Адрес доставки
  - `phone: string` - Контактный телефон

- `IAppState` - Состояние приложения
  - `products: IProduct[]` - Список товаров
  - `cart: ICartItem[]` - Состояние корзины
  - `order: IOrder | null` - Текущий заказ
  - `paymentMethods: IPaymentMethod[]` - Доступные способы оплаты

## Базовый код

### Класс EventEmitter

Отвечает за обмен событиями между компонентами.

**Методы:**
- `on(event: string, listener: Function): void` - Устанавливает обработчик на событие.
- `off(event: string, listener: Function): void` - Удаляет обработчик события.
- `emit(event: string, data?: any): void` - Инициирует событие с данными.

### Класс Component

Базовый класс для компонентов пользовательского интерфейса.

**Методы:**
- `render(data: any): void` - Рендерит компонент.
- `toggleClass(element: HTMLElement, className: string): void` - Переключает класс у элемента.

### Класс Model

Базовый класс для управления данными.

**Методы:**
- `emitChange(event: string, data: any): void` - Генерирует событие изменения модели.
- `subscribe(event: string, listener: Function): void` - Подписывается на события модели.

## MODEL

### Класс AppData

Управляет состоянием приложения: каталогом товаров, корзиной и заказами.

**Параметры конструктора:**
- `initialState: IAppState` - Начальное состояние приложения.

**Методы:**
- `clearCart(): void` - Очищает корзину.
- `addToCart(productId: string, quantity: number): void` - Добавляет товар в корзину.
- `removeFromCart(productId: string): void` - Удаляет товар из корзины.
- `createOrder(orderData: Omit<IOrder, 'id' | 'status'>): void` - Создает новый заказ.

### Класс PaymentManager

Отвечает за управление способами оплаты.

**Методы:**
- `getAvailableMethods(): IPaymentMethod[]` - Возвращает доступные способы оплаты.
- `setPaymentMethod(methodId: string): void` - Устанавливает выбранный способ оплаты.

### Класс DeliveryManager

Отвечает за управление данными о доставке.

**Методы:**
- `setDeliveryData(data: IDeliveryData): void` - Устанавливает данные о доставке.
- `getDeliveryData(): IDeliveryData` - Возвращает текущие данные о доставке.

## VIEW

### Класс ProductCard

Компонент для отображения карточки товара.

**Методы:**
- `render(product: IProduct): void` - Рендерит карточку товара.
- `onAddToCart(callback: (productId: string) => void): void` - Устанавливает обработчик добавления в корзину.

### Класс Cart

Компонент для отображения содержимого корзины.

**Методы:**
- `render(cartItems: ICartItem[]): void` - Отображает содержимое корзины.
- `onCheckout(callback: Function): void` - Устанавливает обработчик оформления заказа.

### Класс OrderSummary

Компонент для отображения итогов заказа.

**Методы:**
- `render(order: IOrder): void` - Рендерит итог заказа.

### Класс PaymentForm

Компонент для выбора способа оплаты.

**Методы:**
- `render(methods: IPaymentMethod[]): void` - Отображает доступные способы оплаты.
- `onPaymentSelect(callback: (methodId: string) => void): void` - Устанавливает обработчик выбора способа оплаты.

### Класс DeliveryForm

Компонент для ввода данных о доставке.

**Методы:**
- `render(data?: IDeliveryData): void` - Отображает форму для ввода данных.
- `onSubmit(callback: (data: IDeliveryData) => void): void` - Устанавливает обработчик отправки данных о доставке.

## Сервисный класс WebLarekAPI

Класс для взаимодействия с сервером.

**Методы:**
- `getProducts(): Promise<IProduct[]>` - Получает список товаров.
- `getProductById(productId: string): Promise<IProduct>` - Получает данные товара по ID.
- `getCart(): Promise<ICartItem[]>` - Получает текущую корзину.
- `addToCart(productId: string, quantity: number): Promise<void>` - Добавляет товар в корзину.
- `removeFromCart(productId: string): Promise<void>` - Удаляет товар из корзины.
- `createOrder(order: Omit<IOrder, 'id' | 'status'>): Promise<IOrder>` - Создает новый заказ.
- `getPaymentMethods(): Promise<IPaymentMethod[]>` - Получает доступные способы оплаты.

## Список событий в приложении

- `cartUpdated` - Обновление содержимого корзины.
- `orderCreated` - Создание нового заказа.
- `productAddedToCart` - Добавление товара в корзину.
- `productRemovedFromCart` - Удаление товара из корзины.
- `paymentMethodSelected` - Выбор способа оплаты.
- `deliveryDataUpdated` - Обновление данных о доставке.

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