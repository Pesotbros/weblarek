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

const buyerModel = new Buyer({
  payment: 'card',
  address: '',
  phone: '',
  email: ''
})

console.log('Проверка метода GetBuyer() у класса Buyer: ', buyerModel.getBuyer())
console.log('Проверка метода Validate() у класса Buyer: ', buyerModel.validate())
buyerModel.updateBuyer('email','123@mail.ru')
console.log('Проверка метода UpdateBuyer() у класса Buyer (добавил почту): ', buyerModel.getBuyer())
buyerModel.clearBuyer()
console.log('Проверка метода ClearBuyer() у класса Buyer: ', buyerModel.getBuyer())

//Тестирование API
const api = new Api(API_URL);
const request = new ApiRequest(api)  
productsModel.setProducts(await request.getApiProducts());  
console.log('Тут вывожу список товаров полученных в результате API запроса',productsModel.getProducts())


