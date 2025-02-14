export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
    DEFAULT_LANGUAGE: "ru",
    ITEMS_PER_PAGE: 12,
    CURRENCY: "RUB",
  };
  
  export const categoryClasses: { [key: string]: string } = {
    "software": "card__category_software",
    "hardware": "card__category_hardware",
    "accessory": "card__category_accessory",
    "book": "card__category_book",
    "other": "card__category_other",
  };
  
  export const PaymentMethods: { [key: string]: string } = {
    "online_card": "Оплата картой онлайн",
    "cash_on_delivery": "Наличный расчет при доставке",
  };