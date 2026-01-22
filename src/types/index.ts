export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | null

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IGetResponse {
  total: number;
  items: IProduct[];
}

export interface IPostRequest extends IBuyer {
  total: number;
  items: string[];
}

export interface IPostResponse {
  id: string;
  total: number;
}

export interface IProduct {
   id: string
   title: string
   image: string
   category: string
   price: number| null
   description: string 
}

export interface IBuyer {
    payment: TPayment
    address: string
    email: string
    phone: string
}
