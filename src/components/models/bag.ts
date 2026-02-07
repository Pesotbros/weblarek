import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Bag {
  // Список всех продуктов в каталоге
  private products: IProduct[] = [];
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  /////////////////Методы ///////////////

  //добавление товара, который был получен в параметре, в массив корзины;
  addProduct(product: IProduct) {
    this.products.push(product);
    this.events?.emit("cart:changed");
  }

  //удаление товара, полученного в параметре из массива корзины;
  removeProduct(product: IProduct): void {
    const index: number = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
    this.events?.emit("cart:changed");
  }

  //получение количества товаров в корзине;
  countProducts(): number {
    return this.products.length;
  }

  //получение массива товаров, которые находятся в корзине;
  listProduct(): IProduct[] {
    return this.products;
  }

  //получение стоимости всех товаров в корзине;
  sumProducts(): number {
    return this.products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );
  }

  //проверка наличия товара в корзине по его id, полученного в параметр метода.
  checkProduct(id: string): boolean {
    return this.products.some((p) => p.id === id);
  }

  clearBag(): void {
    this.products = [];
    this.events?.emit("cart:changed");
  }
}
