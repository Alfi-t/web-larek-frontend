export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const ADDRESS_REGEXP = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{7,}$/;
export const EMAIL_REGEXP = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PHONE_REGEXP = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{10}$/;
export const ERROR_MESSAGES = {
	address: {
		required: 'Необходимо указать адрес',
		invalid: 'Укажите настоящий адрес',
	},
	payment: {
		required: 'Выберите способ оплаты',
	},
	email: {
		required: 'Необходимо указать email',
		invalid: 'Некорректный адрес электронной почты',
	},
	phone: {
		required: 'Необходимо указать телефон',
		invalid: 'Некорректный формат номера телефона',
	},
};

export const settings = {};

export const categoryClasses: { [key: string]: string } = {
	'софт-скил': 'card__category_soft',
	'хард-скил': 'card__category_hard',
	кнопка: 'card__category_button',
	дополнительное: 'card__category_additional',
	другое: 'card__category_other',
};
