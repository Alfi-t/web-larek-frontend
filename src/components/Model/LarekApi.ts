import { ApiListResponse, Api } from '../base/Api';
import { IOrderLot, IOrderResult, IProductItem } from '../../types';

export interface ILarekApi {
	cdn: string;
	items: IProductItem[];
	getListProducts: () => Promise<IProductItem[]>;
	postOrderLot: (order: IOrderLot) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
	cdn: string;
	items: IProductItem[];

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
		this.items = [];
	}

	// получаем массив объектов(карточек) с сервера
	getListProducts(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	// получаем ответ от сервера по сделанному заказу
	postOrderLot(order: IOrderLot): Promise<IOrderResult> {
		return this.post(`/order`, order).then((data: IOrderResult) => data);
	}
}
