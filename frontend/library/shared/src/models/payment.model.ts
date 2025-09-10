import { BasketModel } from "./basket.model";

export interface PaymentModel {
  _id?: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  cardHolderName: string;
  cardNumber: string;
  cvv: number;
  expireDate: string;
  installmentOption: string;
  baskets: BasketModel[];
  userId: string;
  olusturulmaTarihi?: Date;
}

export const initialPayment: PaymentModel = {
  fullName:"",
  phoneNumber: "",
  city: "",
  district: "",
  fullAddress: "",
  cardHolderName: "",
  cardNumber: "",
  cvv: 0,
  expireDate: "",
  installmentOption: "",
  baskets: [],
  userId: "",
}
