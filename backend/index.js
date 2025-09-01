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


//URUN LISTELEME İŞLEMİ (GET)
app.get('/urun/listele', async (req, res) => {
  try {
    const products = await Product.find(); // MongoDB'den tüm ürünleri çek
    res.json(products); // JSON olarak gönder
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
});



//URUN EKLEME İŞLEMİ (POST)
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


//SİLME İŞLEMİ (DELETE)
app.delete('/urun/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // MongoDB ObjectId kontrolü (isteğe bağlı)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün silinemedi", error: error.message });
  }
});

// PUT /urun/:id → Ürünü güncelle
app.put('/urun/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // MongoDB ObjectId kontrolü (isteğe bağlı ama önerilir)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({ message: "Ürün başarıyla güncellendi", product: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün güncellenemedi", error: error.message });
  }
});




