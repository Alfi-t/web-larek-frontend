// Типы для обработки событий
export type EventName = string | RegExp;
export type Subscriber = (data?: any) => void;

// Общие методы события
export interface IEventManager {
  on(event: EventName, listener: Subscriber): void;
  off(event: EventName, listener: Subscriber): void;
  emit(event: EventName, data?: any): void;
}

// Данные, возвращаемые сервером
export type ApiResponse<T> = {
  total: number;
  items: T[];
};

// Основные интерфейсы данных
export interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface ICartItem {
  productId: string;
  quantity: number;
}

export interface IOrder {
  id: string;
  items: ICartItem[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
}

export interface IApiMethods {
  getProducts(): Promise<IProduct[]>;
  getProduct(id: string): Promise<IProduct>;
  createOrder(order: Omit<IOrder, 'id'>): Promise<IOrder>;
}

// Состояние приложения
export interface IAppState {
  products: IProduct[];
  cart: ICartItem[];
  order: IOrder | null;
}

  