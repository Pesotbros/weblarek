import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Catalog {
  // Список всех продуктов в каталоге
  private products: IProduct[] = [];

  // Текущий выбранный продукт
  private selectedProduct: string | null = null;

  //Слушатель
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  //Методы

  // сохранение массива товаров полученного в параметрах метода;
  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events?.emit("catalog:changed");
  }

  // получение массива товаров из модели;
  getProducts(): IProduct[] {
    return this.products;
  }

  // получение одного товара по его id;
  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  // сохранение товара для подробного отображения;
  setSelectedProduct(id: string): void {
    this.selectedProduct = id;
    this.events?.emit("catalog:select");
  }

  // получение товара для подробного отображения.
  getSelectedProduct(): IProduct | null {
    if (!this.selectedProduct) return null;
    return this.getProductById(this.selectedProduct) ?? null;
  }
}
