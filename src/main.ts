import { Catalog } from './components/models/catalog';
import {apiProducts} from './utils/data'
import './scss/styles.scss';
import { Bag } from './components/models/bag';
import { Buyer } from './components/models/buyer';
import { ApiRequest } from './components/models/ApiRequest';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

////////////////////////////// Тестирование Локальной модели данных////////////////

//Проверка каталога
const productsModel = new Catalog();
productsModel.setProducts(apiProducts.items); 
productsModel.setSelectedProduct(apiProducts.items[1])

console.log('Массив товаров из каталога: ', productsModel.getProducts()) 
console.log('Проверка метода getProductById у класса catalog: ', productsModel.getProductById(apiProducts.items[0].id)) 
console.log('Проверка метода getSelectedProduct у класса catalog: ', productsModel.getSelectedProduct()) 

//Проверка корзины

const bagModel = new Bag()

bagModel.addProduct(apiProducts.items[2])
bagModel.addProduct(apiProducts.items[3])

console.log('Проверка метода ListProduct() у класса Bag: ', bagModel.listProduct()) 
console.log('Проверка метода CountProducts() у класса Bag: ', bagModel.countProducts()) 
console.log('Проверка метода SumProducts() у класса Bag: ', bagModel.sumProducts() ) 
console.log('Проверка метода CheckProduct() у класса Bag: ', bagModel.checkProduct(apiProducts.items[3].id) ) 
bagModel.removeProduct(apiProducts.items[3])
console.log('Проверка метода RemoveProduct() у класса Bag: ', bagModel.listProduct()) 
bagModel.clearBag()
console.log('Проверка метода ClearBag() у класса Bag: ', bagModel.listProduct()) 

//Проверка покупателя



const buyer = new Buyer();
console.log('--- Покупатель ---');
console.log('Ошибки валидации (пустая форма):', buyer.validate());
buyer.setData({ payment: 'cash' });
console.log('Ошибки после выбора оплаты:', buyer.validate());
buyer.setData({ address: 'Г. , ул. , д.' });
console.log('Ошибки после адреса:', buyer.validate());
buyer.setData({ email: 'test@example.com', phone: '+8 (800) 555-35-35' });
console.log('Ошибки после заполнения всех полей:', buyer.validate());
console.log('Данные покупателя:', buyer.getBuyer());
buyer.clearBuyer();
console.log('После очистки данных покупателя:', buyer.getBuyer(), buyer.validate());


//Тестирование API
const api = new Api(API_URL);
const request = new ApiRequest(api)  
async function init() {
  const data = await request.getApiProducts();
  productsModel.setProducts(data);
  console.log('Тут вывожу список товаров полученных в результате API запроса', productsModel.getProducts());
}


// Вызов функции с обработкой ошибок
init().catch(console.error);



