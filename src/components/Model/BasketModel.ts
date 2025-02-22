import { IProductItem } from "../../types";

export interface IBasketModel {
  basketProducts: IProductItem[];
  getCounter: () => number;
  getSumAllProducts: () => number;
  setSelectedCard(data: IProductItem): void;
  deleteCardToBasket(item: IProductItem): void;
  clearBasketProducts(): void;
}

export class BasketModel implements IBasketModel {
  protected _basketProducts: IProductItem[]; // список карточек товара в корзине

  constructor() {
    this._basketProducts = [];
  }

  set basketProducts(data: IProductItem[]) {
    this._basketProducts = data;
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

  // добавить карточку товара в корзину
  setSelectedCard(data: IProductItem) {
    if (!data) {
      console.error("Попытка добавить некорректный товар в корзину:", data);
      return;
    }
    this._basketProducts.push(data);
  }

  // удалить карточку товара из корзины
  deleteCardToBasket(item: IProductItem) {
    const index = this._basketProducts.indexOf(item);
    if (index >= 0) {
      this._basketProducts.splice(index, 1);
    }
  }

  clearBasketProducts() {
    this.basketProducts = [];
  }
}