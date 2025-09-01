const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen kategori adını giriniz"]
  },
});

module.exports = mongoose.model('Category', CategorySchema);
