import { IEvents } from '../base/Events';

export interface IOrder {
	formOrder: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	paymentSelection: String;
	formErrors: HTMLElement;
	render(): HTMLElement;
}

export class Order implements IOrder {
	formOrder: HTMLFormElement;
	buttonAll: HTMLButtonElement[];
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	private _paymentSelection: string = '';
	private isAddressSelected: boolean = false;

	constructor(template: HTMLTemplateElement, protected Events: IEvents) {
		this.formOrder = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
		this.buttonSubmit = this.formOrder.querySelector('.order__button');
		this.formErrors = this.formOrder.querySelector('.form__errors');

		this.buttonAll.forEach((item) => {
			item.addEventListener('click', () => {
				this.paymentSelection = item.name;
				Events.emit('order:paymentSelection', item);
				this.checkFormValidity(); // Проверяем состояние кнопки после выбора
			});
		});

		this.formOrder.addEventListener('input', (event: Event) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;
			this.Events.emit(`order:changeAddress`, { field, value });

			// Если выбран адрес, снимаем блокировку с кнопки
			if (field === 'address' && value.trim() !== '') {
				this.isAddressSelected = true;
			}

			this.checkFormValidity(); // Проверяем состояние кнопки
		});

		this.formOrder.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.Events.emit('contacts:open');

			// Очистить форму после отправки
			this.formOrder.reset();
			this.isAddressSelected = false; // Сбросить выбор адреса
			this.checkFormValidity(); // Проверить состояние кнопки после отправки
		});
	}

	// Геттер для paymentSelection
	get paymentSelection(): string {
		return this._paymentSelection;
	}

	// Сеттер для paymentSelection
	set paymentSelection(payment: string) {
		this._paymentSelection = payment;
		this.buttonAll.forEach((item) => {
			item.classList.toggle('button_alt-active', item.name === payment);
		});
	}

	// Проверка состояния кнопки
	private checkFormValidity() {
		// Разрешить кнопку, если выбран адрес и выбран способ оплаты
		this.buttonSubmit.disabled = !(
			this.isAddressSelected && this.paymentSelection
		);
	}

	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}

	render() {
		return this.formOrder;
	}
}
