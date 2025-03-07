import { IEvents } from '../base/Events';

export interface ISuccess {
	success: HTMLElement;
	description: HTMLElement;
	button: HTMLButtonElement;
	render(total: number): HTMLElement;
}

export class Success {
	success: HTMLElement;
	description: HTMLElement;
	button: HTMLButtonElement;

	constructor(template: HTMLTemplateElement, protected Events: IEvents) {
		this.success = template.content
			.querySelector('.order-success')
			.cloneNode(true) as HTMLElement;
		this.description = this.success.querySelector(
			'.order-success__description'
		);
		this.button = this.success.querySelector('.order-success__close');

		this.button.addEventListener('click', () => {
			Events.emit('success:close');
		});
	}

	render(total: number) {
		this.description.textContent = `Списано ${total} синапсов`;
		return this.success;
	}
}
