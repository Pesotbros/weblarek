import type { IBuyer, TPayment } from '../../types';

export class Buyer {
  private payment: TPayment = '';
  private email = '';
  private phone = '';
  private address = '';

  constructor () {}

  //сохранение данных

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;
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