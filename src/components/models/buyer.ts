import type { IBuyer, TPayment } from '../../types';

export class Buyer {
  private payment: TPayment | null = null;
  private email = '';
  private phone = '';
  private address = '';

  constructor () {}

//сохранение данных в модели
updateBuyer<K extends keyof Buyer>(field: K, value: Buyer[K]): void {
  this[field] = value as this[K];
}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
  }

  //получение всех данных покупателя

  getBuyer(): IBuyer | null {
    if (!this.payment) return null;

    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

//очистка данных покупателя;

  clearBuyer(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';
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