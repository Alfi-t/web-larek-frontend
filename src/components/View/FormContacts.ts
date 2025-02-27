import { IEvents } from '../base/Events';

export interface IContacts {
	formContacts: HTMLFormElement;
	inputAll: HTMLInputElement[];
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;
	render(): HTMLElement;
}

export class Contacts implements IContacts {
	formContacts: HTMLFormElement;
	inputAll: HTMLInputElement[];
	buttonSubmit: HTMLButtonElement;
	formErrors: HTMLElement;

	constructor(template: HTMLTemplateElement, protected Events: IEvents) {
		this.formContacts = template.content
			.querySelector('.form')
			.cloneNode(true) as HTMLFormElement;
		this.inputAll = Array.from(
			this.formContacts.querySelectorAll('.form__input')
		);
		this.buttonSubmit = this.formContacts.querySelector('.button');
		this.formErrors = this.formContacts.querySelector('.form__errors');

		this.inputAll.forEach((item) => {
			item.addEventListener('input', (event) => {
				const target = event.target as HTMLInputElement;
				const field = target.name;
				const value = target.value;
				this.Events.emit(`contacts:changeInput`, { field, value });
				this.validateForm();
			});
		});

		this.formContacts.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			if (this.isValid()) {
				this.Events.emit('success:open');
				this.Events.emit('form:clear');
			} else {
				this.displayErrors(); // Отображаем ошибки, если форма не валидна
			}
		});

		// Подписка на событие очистки формы
		this.Events.on('form:clear', () => this.clearForm());
	}

	// Валидация всех полей формы
	validateForm() {
		let isValid = true;
		this.inputAll.forEach((input) => {
			if (!input.checkValidity()) {
				isValid = false;
			}
		});
		this.valid = isValid; // Обновляем кнопку отправки
	}

	// Проверка, валидна ли форма
	isValid(): boolean {
		return this.inputAll.every((input) => input.checkValidity());
	}

	// Метод для отображения ошибок
	displayErrors() {
		this.formErrors.innerHTML =
			'Пожалуйста, заполните все обязательные поля корректно';
	}

	set valid(value: boolean) {
		this.buttonSubmit.disabled = !value;
	}
	// Метод для очистки формы
	clearForm() {
		this.inputAll.forEach((i) => (i.value = ''));
	}

	render() {
		return this.formContacts;
	}
}
