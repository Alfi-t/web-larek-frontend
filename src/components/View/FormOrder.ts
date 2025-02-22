import { IEvents } from "../base/events";

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

  constructor(template: HTMLTemplateElement, protected events: IEvents) {
    this.formOrder = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.buttonAll = Array.from(this.formOrder.querySelectorAll('.button_alt'));
    this.buttonSubmit = this.formOrder.querySelector('.order__button');
    this.formErrors = this.formOrder.querySelector('.form__errors');

    this.buttonAll.forEach(item => {
      item.addEventListener('click', () => {
        this.paymentSelection = item.name;
        events.emit('order:paymentSelection', item);
      });
    });

    this.formOrder.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const field = target.name;
      const value = target.value;
      this.events.emit(`order:changeAddress`, { field, value });
    });

    this.formOrder.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('contacts:open');
    });
  }

    // Геттер для paymentSelection
    get paymentSelection(): string {
      return this._paymentSelection;
    }

    // Сеттер для paymentSelection
    set paymentSelection(payment: string) {
      this._paymentSelection = payment;
      this.buttonAll.forEach(item => {
        item.classList.toggle('button_alt-active', item.name === payment);
      });
  }

  set valid(value: boolean) {
    this.buttonSubmit.disabled = !value;
  }

  render() {
    return this.formOrder;
  }
}