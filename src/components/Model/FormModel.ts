import { IEvents } from '../base/events';
import { FormErrors } from '../../types/index';
import { ADDRESS_REGEXP, EMAIL_REGEXP, PHONE_REGEXP, ERROR_MESSAGES } from '../../utils/constants';
export interface IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  setOrderAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  validateOrder(): boolean;
  validateContacts(): boolean;
  getOrderLot(): object;
  setOrderData(field: string, value: string): void;
}

export class FormModel implements IFormModel {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  formErrors: FormErrors = {};

  constructor(protected events: IEvents) {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
  }

  setOrderAddress(address: string) {
    this.address = address;
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  setEmail(email: string) {
    this.email = email;
    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  setPhone(phone: string) {
    this.phone = phone;
    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  setOrderData(field: string, value: string) {
    if (field === 'email') {
      this.email = value;
    } else if (field === 'phone') {
      this.phone = value;
    } else if (field === 'address') {
      this.address = value;
    }
    
    if (this.validateContacts()) {
      this.events.emit('order:ready', this.getOrderLot());
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};

    if (!this.address) {
      errors.address = ERROR_MESSAGES.address.required;
    } else if (!ADDRESS_REGEXP.test(this.address)) {
      errors.address = ERROR_MESSAGES.address.invalid;
    } else if (!this.payment) {
      errors.payment = ERROR_MESSAGES.payment.required;
    }

    this.formErrors = errors;
    this.events.emit('formErrors:address', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};

    if (!this.email) {
      errors.email = ERROR_MESSAGES.email.required;
    } else if (!EMAIL_REGEXP.test(this.email)) {
      errors.email = ERROR_MESSAGES.email.invalid;
    }

    if (this.phone.startsWith('8')) {
      this.phone = '+7' + this.phone.slice(1);
    }

    if (!this.phone) {
      errors.phone = ERROR_MESSAGES.phone.required;
    } else if (!PHONE_REGEXP.test(this.phone)) {
      errors.phone = ERROR_MESSAGES.phone.invalid;
    }

    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  getOrderLot() {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
      total: this.total,
      items: this.items,
    };
  }

  clearForm() {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.total = 0;
    this.items = [];
    this.formErrors = {};
  }
}
