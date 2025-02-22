import { IProductItem } from "../../types";
import { IEvents } from "../base/events";

export interface IDataModel {
  productCard: IProductItem[];
  selectedCard: IProductItem | null;
  setPreview(item: IProductItem): void;
}

export class DataModel implements IDataModel {
  protected _productCard: IProductItem[];
  protected _selectedCard: IProductItem | null;

  constructor(protected events: IEvents) {
    this._productCard = [];
    this._selectedCard = null;
  }

  set productCard(data: IProductItem[]) {
    this._productCard = data;
    this.events.emit('productCard:receive');
  }

  get productCard() {
    return this._productCard;
  }

  setPreview(item: IProductItem) {
    this._selectedCard = item;
    this.events.emit('modalCard:open', item)
  }

  get selectedCard() {
    return this._selectedCard;
  }
}