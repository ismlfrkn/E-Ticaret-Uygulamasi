export interface ProductModel {
  _id: string;       // MongoDB id
  name: string;
  imageUrl?: string;
  price: number;
  stock: number;
  categoryName: string;
  categoryId:string;
}