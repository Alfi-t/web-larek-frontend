import { IProductItem } from "../../types";
import { EventEmitter } from "..//base/events";
export interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  addToBasket(data: IProductItem): void;
  deleteProductFromBasket(item: IProductItem): void;
  clearBasketProducts(): void;
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[]; // список карточек товара в корзине
  private _eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this._basketProducts = [];
    this._eventEmitter = eventEmitter;
  }

  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
    this._eventEmitter.emit("basket:change", this._basketProducts);
  }

  get basketProducts() {
    return this._basketProducts;
  }

  // количество товара в корзине
  getCounter() {
    return this.basketProducts.length;
  }

  // сумма всех товаров в корзине
  getSumAllProducts() {
    return this.basketProducts.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  // добавить товар в корзину
addToBasket(data: IProductItem) {
  if (!data) {
    console.error("Попытка добавить некорректный товар в корзину:", data);
    return;
  }

  // Проверка, есть ли товар в корзине
  if (this.isProductInBasket(data)) {
    console.log("Этот товар уже в корзине");
    return;
  }
  this._basketProducts.push(data);
  this._eventEmitter.emit("basket:change", this._basketProducts);
}

// метод для проверки, есть ли товар в корзине
isProductInBasket(product: IProductItem): boolean {
  return this._basketProducts.some(item => item.id === product.id);
}

  // удалить карточку товара из корзины
  deleteProductFromBasket(item: IProductItem) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
      this._eventEmitter.emit("basket:change", this._basketProducts);
    }
  }

  clearBasketProducts() {
    this.basketProducts = [];
    this._eventEmitter.emit("basket:change", this._basketProducts);
  }
}