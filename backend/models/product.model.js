const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Lütfen ürün adını giriniz"]
    },
    price: {
        type: String,
        required: [true, "Lütfen ürün fiyatını giriniz"],
    },
    stock: {
        type: String,
        required: [true, "Lütfen ürün adetini giriniz"],
    },
    imageUrl: {
        type: String,
        default: ""
    },
    categoryId:{
        type:String,
        default:""
    },
    categoryName: {
        type: String,
        default:""
    },

   },
   {
        timestamps:true
   }
);


const Product = mongoose.model("Product",ProductSchema);

module.exports = Product;