import { IBuyer, TPayment } from "../../types";


export class Buyer implements IBuyer {
  public payment: TPayment;
  public address: string;
  public email: string;
  public phone: string;

  constructor(data: IBuyer) {
    this.payment = data.payment;
    this.address = data.address;
    this.email = data.email;
    this.phone = data.phone;
  }
//Методы

//сохранение данных в модели
updateBuyer<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
  this[field] = value as this[K];
}

//получение всех данных покупателя
getBuyer(): IBuyer {
  return {
    payment: this.payment,
    address: this.address,
    email: this.email,
    phone: this.phone
  };
}

//очистка данных покупателя;
clearBuyer(): void {
  this.payment = null
  this.address = '';
  this.email = '';
  this.phone = '';
}

//валидация данных
validate(): { [K in keyof IBuyer]?: string } {
  const errors: { [K in keyof IBuyer]?: string } = {};
  if (this.payment == null) {
    errors.payment = 'Не выбран тип оплаты';
  }
  if(!this.address?.trim()) {
    errors.address = 'Укажите адрес';
  }
  if (!this.email?.trim()) {
    errors.email = 'Укажите почту';
  }
  if (!this.phone.trim()) {
    errors.phone = 'Укажите телефон';
  }
  
  return errors
}
}