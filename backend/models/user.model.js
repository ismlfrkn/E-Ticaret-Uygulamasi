const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Lütfen adınızı giriniz"]
    },
    lastName: {
        type: String,
        required: [true, "Lütfen soyadınızı giriniz"],
    },
    userName: {
        type: String,
        required: [true, "Lütfen kullanıcı adınızı giriniz"],
    },
    email: {
        type: String,
        required: [true, "Lütfen email adresinizi giriniz"],
    },
    password: {
        type: String,
        required: [true, "Lütfen şifrenizi giriniz"],
    },
    isAdmin:
    {
       type:Boolean,
       default:false
    }
});


const User = mongoose.model("User", UserSchema);
module.exports = User;
