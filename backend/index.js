const express = require('express');
const mongoose = require('mongoose');
const Product = require("./models/product.model.js")
const cors = require('cors'); 

const app = express();

app.use(cors());  
app.use(express.json()); //Json verileri için ekliyoruz.


mongoose.connect("mongodb+srv://admin:admin@eticaretdb.gcwgu6c.mongodb.net/E-Ticaret?retryWrites=true&w=majority&appName=EticaretDB")
.then(()=>{
    console.log("Connected to database!")
    app.listen(5000,()=>{
    console.log("Server is running on port 5000");
    });
})
.catch(()=>
{
    console.log("Connection failed");
})


// GET /products → Tüm ürünleri getir
app.get('/urun/listele', async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB'den tüm ürünleri çek
    res.json(products); // JSON olarak gönder
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
});



// POST /urun/ekle → Tekli ürün ekleme
app.post('/urun/ekle', async (req, res) => {
  try {
    const product = new Product(req.body);  // Tek obje
    const result = await product.save();    // save ile MongoDB'ye ekle

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Ürün eklenemedi', 
      error: error.message 
    });
  }
});


