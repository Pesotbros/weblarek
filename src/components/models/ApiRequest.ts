import {
  IApi,
  IProduct,
  IGetResponse,
  IPostResponse,
  IPostRequest,
} from "../../types";


export class ApiRequest {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  // Методы

  //Get запрос
  async getApiProducts(): Promise<IProduct[]> {
    const response = await this.api.get<IGetResponse>("/product/");
    return response.items;
  }
  // Post запрос
  async sendApiProducts(Data: IPostRequest): Promise<IPostResponse> {
    return this.api.post<IPostResponse>("/order/", Data, "POST");
  }
}
