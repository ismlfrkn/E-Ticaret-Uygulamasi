const mongoose = require('mongoose');

const BasketSchema = new mongoose.Schema({
    productId: 
    {
        type: mongoose.Schema.Types.ObjectId, // 🔑 product referans
        ref: "Product",
        required: true
    },
    quantity: 
    {
        type: Number,
        default: 1,
    },
    userId:
    {
        type: mongoose.Schema.Types.ObjectId, // 🔑 product referans
        ref: "User",
        required: true
    }
    
});

module.exports = mongoose.model('Basket', BasketSchema);
