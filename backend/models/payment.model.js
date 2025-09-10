const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const PaymentSchema = new Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  fullAddress: { type: String, required: true },
  cardHolderName: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cvv: { type: Number, required: true },
  expireDate: { type: String, required: true },
  installmentOption: { type: String, required: true },
  basketIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Basket', // Basket modelinin adı
      required: true
    }
  ],
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true // Oluşturulma ve güncellenme tarihlerini ekler
});
const Payment = model('Payment', PaymentSchema);

module.exports = Payment;
