import { createElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { PageView } from '../../components/View/Page';

export interface IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	headerBasketButton: HTMLButtonElement;
	headerBasketCounter: HTMLElement;
	renderSumAllProducts(sumAll: number): void;
	render(items: HTMLElement[], total: number): HTMLElement;
	update(items: HTMLElement[], total: number): void;
}

export class Basket implements IBasket {
	basket: HTMLElement;
	title: HTMLElement;
	basketList: HTMLElement;
	button: HTMLButtonElement;
	basketPrice: HTMLElement;
	headerBasketButton: HTMLButtonElement;
	headerBasketCounter: HTMLElement;

	constructor(template: HTMLTemplateElement, protected Events: IEvents) {
		this.basket = template.content
			.querySelector('.basket')
			.cloneNode(true) as HTMLElement;
		this.title = this.basket.querySelector('.modal__title');
		this.basketList = this.basket.querySelector('.basket__list');
		this.button = this.basket.querySelector('.basket__button');
		this.basketPrice = this.basket.querySelector('.basket__price');
		this.headerBasketButton = document.querySelector('.header__basket');
		this.headerBasketCounter = document.querySelector(
			'.header__basket-counter'
		);

		this.button.addEventListener('click', () => {
			this.Events.emit('order:open');
		});
		this.headerBasketButton.addEventListener('click', () => {
			this.Events.emit('basket:open');
		});

		this.items = [];
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.basketList.replaceChildren(...items);
			this.button.removeAttribute('disabled');
		} else {
			this.button.setAttribute('disabled', 'disabled');
			this.basketList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	renderSumAllProducts(sumAll: number) {
		this.basketPrice.textContent = String(sumAll + ' синапсов');
	}

	render(items: HTMLElement[], total: number) {
		this.title.textContent = 'Корзина';
		this.items = items;
		this.renderSumAllProducts(total);
		return this.basket;
	}

	update(items: HTMLElement[], total: number) {
		this.render(items, total);
	}
}
