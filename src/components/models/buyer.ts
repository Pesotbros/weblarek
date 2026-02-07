import type { IBuyer, TPayment } from '../../types';
import { EventEmitter } from "../base/Events";

type BuyerChangeField = keyof IBuyer | "clear";

export class Buyer implements IBuyer {
  public payment: TPayment = '';
  public address: string = "";
  public email: string = "";
  public phone: string = "";
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }
  //Методы

  updateBuyer<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this[field] = value as this[K];
    this.events?.emit("buyer:change", { field: field as BuyerChangeField });
  }

  //получение всех данных покупателя

getBuyer(): IBuyer {
  return {
    payment: this.payment,
    email: this.email ?? '',
    phone: this.phone ?? '',
    address: this.address ?? ''
  };
}


//очистка данных покупателя;

  clearBuyer(): void {
    this.payment = '';
    this.email = '';
    this.phone = '';
    this.address = '';
    this.events?.emit("buyer:change", { field: "clear" });
  }

//валидация данных
  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (this.address === '') errors.address = 'Необходимо указать адрес';
    if (this.email === '') errors.email = 'Укажите email';
    if (this.phone === '') errors.phone = 'Укажите телефон';

    return errors;
  }
}