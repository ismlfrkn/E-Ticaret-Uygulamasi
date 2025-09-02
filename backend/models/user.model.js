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

// Şifreyi kaydetmeden önce hashle
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Şifre karşılaştırma metodu
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
