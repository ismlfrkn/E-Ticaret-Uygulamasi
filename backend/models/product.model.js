const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lütfen ürün adını giriniz"]
    },
    price: {
        type: Number,
        required: [true, "Lütfen ürün fiyatını giriniz"],
        min: [0, "Fiyat negatif olamaz"]
    },
    stock: {
        type: Number,
        required: [true, "Lütfen ürün adetini giriniz"],
        min: [0, "Ürün adeti negatif olamaz"]
    },
    imageUrl: {
        type: String,
        default: ""
    },
    categoryId: {
    type: mongoose.Schema.Types.ObjectId, // 🔑 kategoriye referans
    ref: "Category",
    required: true
    },

   },
   {
        timestamps:true
   }
);


const Product = mongoose.model("Product",ProductSchema);

module.exports = Product;