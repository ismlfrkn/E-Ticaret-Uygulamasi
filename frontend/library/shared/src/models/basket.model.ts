export interface BasketModel {
  _id?: string;       // MongoDB id
  productId: string;
  productName:string;
  quantity: number;
  price: number;
  userId?: string;
  productImageUrl?: string;
}