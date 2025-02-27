import { IProductItem } from '../../types';
import { IEvents } from '../base/Events';

export interface IDataModel {
	products: IProductItem[];
	selectedCard: IProductItem | null;
	setPreview(item: IProductItem): void;
}

export class DataModel implements IDataModel {
	protected _products: IProductItem[];
	protected _selectedCard: IProductItem | null;

	constructor(protected Events: IEvents) {
		this._products = [];
		this._selectedCard = null;
	}

	set products(data: IProductItem[]) {
		this._products = data;
		this.Events.emit('products:receive');
	}

	get products() {
		return this._products;
	}

	setPreview(item: IProductItem) {
		this._selectedCard = item;
		this.Events.emit('modalCard:open', item);
	}

	get selectedCard() {
		return this._selectedCard;
	}
}
