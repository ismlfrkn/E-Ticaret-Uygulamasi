const express = require('express');
const mongoose = require('mongoose');
const Product = require("./models/product.model.js")
const Category = require("./models/category.model.js");
const User = require("./models/user.model.js");
const Basket = require("./models/basket.model.js");
const Payment = require("./models/payment.model.js");
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

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

app.get('/urun/listele', async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const categoryKey = req.query.categoryKey;

    const isPagination = Number.isInteger(page) && Number.isInteger(pageSize);

    const categoryFilter = categoryKey && mongoose.Types.ObjectId.isValid(categoryKey)
      ? { categoryId: new mongoose.Types.ObjectId(categoryKey) }
      : {};

    let query = Product.find(categoryFilter)
      .populate("categoryId", "name key")
      .lean();

    if (isPagination) {
      query = query.skip((page - 1) * pageSize).limit(pageSize);
    }

    const products = await query.exec();

    const result = products.map(p => ({
      ...p,
      categoryName: p.categoryId?.name || "Bilinmeyen kategori",
      categoryId: p.categoryId?._id || null
    }));

    if (isPagination) {
      const totalCount = await Product.countDocuments(categoryFilter);
      return res.json({ items: result, totalCount });
    } else {
      return res.json(result);
    }
  } catch (error) {
    console.error("ÜRÜN LİSTELEME HATASI:", error);
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
});






//URUN EKLEME İŞLEMİ (POST)
app.post('/urun/ekle', async (req, res) => {
  try {
    const product = new Product(req.body);  
    const result = await product.save();    

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Ürün eklenemedi', 
      error: error.message 
    });
  }
});

//URUN SİLME İŞLEMİ (DELETE)
app.delete('/urun/:id', async (req, res) => {
  try {
    const id = req.params.id;

    
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

//URUN GUNCELLEME (PUT)
app.put('/urun/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
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

// URUN GET BY ID
app.get('/urun/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    
    const product = await Product.findById(id).populate("categoryId", "name");

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({
      ...product.toObject(),
      categoryName: product.categoryId?.name || "Bilinmeyen kategori",
      categoryId: product.categoryId?._id || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün alınamadı", error: error.message });
  }
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*-------------------------------------------------------------------------------------------------------------------------------------------------- */
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

//KATEGORİ LISTELEME İŞLEMİ (GET)
app.get('/kategori/listele', async (req, res) => {
  try {
    const categories = await Category.find(); // MongoDB'den tüm ürünleri çek
    res.json(categories); // JSON olarak gönder
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ürünler alınamadı', error: error.message });
  }
});

// KATEGORİ EKLEME İŞLEMİ (POST)
app.post('/kategori/ekle', async (req, res) => {
  try {
    const category = new Category(req.body); // Tek obje
    const result = await category.save();    // save ile MongoDB'ye ekle

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: 'Kategori eklenemedi', 
      error: error.message 
    });
  }
});


//KATEGORİ SİLME İŞLEMİ (DELETE)
app.delete('/kategori/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // MongoDB ObjectId kontrolü (isteğe bağlı)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await Category.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ürün silinemedi", error: error.message });
  }
});

// KATEGORİ GÜNCELLEME (PUT)
app.put('/kategori/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    // MongoDB ObjectId kontrolü (isteğe bağlı ama önerilir)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await Category.findByIdAndUpdate(id, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.status(200).json({ message: "Kategori başarıyla güncellendi", category: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kategori güncellenemedi", error: error.message });
  }
});

// ID'E GORE KATEGORİ ÇAĞIRMA
app.get('/kategori/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Geçerli MongoDB ObjectId kontrolü
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const category = await Category.findById(id); // Category modelini import etmelisin

    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kategori alınamadı", error: error.message });
  }
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

// KULLANICI LİSTELEME veya LOGIN KONTROLÜ
app.get('/kullanici/listele', async (req, res) => {
  try {
    const { userName, password } = req.query;  // query parametrelerini oku

    if (userName && password) {
      // Kullanıcı adı ve şifre ile kontrol
      const user = await User.findOne({ userName, password });

      if (!user) {
        return res.status(401).json({ message: "Geçersiz kullanıcı adı veya şifre" });
      }

      return res.json(user);
    }

    // Eğer parametre gelmemişse -> tüm kullanıcıları döndür
    const users = await User.find();
    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kullanıcılar alınamadı', error: error.message });
  }
});


app.post('/kullanici/ekle', async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    // MongoDB duplicate key hatası kontrolü
    if (error.code === 11000) {
      const duplicatedField = error.keyValue ? Object.keys(error.keyValue)[0] : null;
      let fieldName = duplicatedField;

      // userName ve email için Türkçe anlamlı mesaj
      if (duplicatedField === 'userName') fieldName = 'username';
      else if (duplicatedField === 'email') fieldName = 'email';

      return res.status(400).json({ message: `${fieldName || 'Alan'} zaten kullanılıyor.` });
    }

    // Diğer hatalar için genel mesaj
    res.status(500).json({ message: 'Kullanıcı eklenemedi', error: error.message });
  }
});



// KULLANICI SİLME (DELETE)
app.delete('/kullanici/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ message: "Kullanıcı başarıyla silindi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kullanıcı silinemedi", error: error.message });
  }
});

// KULLANICI GÜNCELLEME (PUT)
app.put('/kullanici/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const result = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!result) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json({ message: "Kullanıcı başarıyla güncellendi", user: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kullanıcı güncellenemedi", error: error.message });
  }
});

// ID'E GORE KULLANICI ÇAĞIRMA
app.get('/kullanici/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Geçersiz ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Kullanıcı alınamadı", error: error.message });
  }
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post('/basket/ekle', async (req, res) => {
  try {
    const basket = new Basket(req.body);  // req.body zaten tüm alanları içeriyor
    const result = await basket.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Sepete ekleme hatası:", error);
    res.status(500).json({
      message: 'Sepete ürün eklenemedi',
      error: error.message
    });
  }
});



// KULLANICIYA GÖRE SEPET LİSTELE
app.get('/basket/listele/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Sepeti al + productId populate
    const items = await Basket.find({ userId }).populate("productId");

    // BasketModel formatına çevir
    const result = items.map(b => ({
      _id: b._id,
      userId: b.userId,
      productId: b.productId._id.toString(), // string olarak gönder
      productName: b.productId.name,
      productImageUrl: b.productId.imageUrl,
      quantity: b.quantity,
      price: b.productId.price
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Sepet listeleme hatası:", error);
    res.status(500).json({
      message: "Sepet listelenemedi",
      error: error.message
    });
  }
});

// Sepetteki ürünün miktarını güncelle
app.put('/basket/guncelle/:basketId', async (req, res) => {
  try {
    const { basketId } = req.params;
    const updateData = req.body; // { quantity: yeni değer, vs... }

    const updated = await Basket.findByIdAndUpdate(
      basketId,
      { $set: updateData },
      { new: true } // güncellenmiş dökümanı dön
    );

    if (!updated) {
      return res.status(404).json({ message: "Sepet ürünü bulunamadı" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Sepet güncelleme hatası:", error);
    res.status(500).json({
      message: "Sepet güncellenemedi",
      error: error.message
    });
  }
});







// Sepetteki tek ürünü sil
app.delete('/basket/sil/:basketId', async (req, res) => {
  try {
    const { basketId } = req.params;

    const result = await Basket.findByIdAndDelete(basketId);
    if (!result) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({ message: 'Ürün sepetten kaldırıldı' });
  } catch (error) {
    console.error("Sepet ürünü silme hatası:", error);
    res.status(500).json({
      message: "Ürün silinemedi",
      error: error.message
    });
  }
});

// DELETE /api/basket/temizle/:userId
app.delete('/basket/temizle/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    await Basket.deleteMany({ userId });
    res.json({ message: 'Sepet temizlendi' });
  } catch (err) {
    res.status(500).json({ message: 'Sepet temizleme hatası', error: err });
  }
});


// Tüm sepet ürünlerini listele (mapleme yok, direkt döndür)
app.get('/basket/listele', async (req, res) => {
  try {
    // populate ile product bilgilerini getiriyoruz
    const items = await Basket.find().populate("productId");

    res.status(200).json(items);
  } catch (error) {
    console.error("Sepet listeleme hatası:", error);
    res.status(500).json({
      message: "Sepet listelenemedi",
      error: error.message
    });
  }
});

/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------------------------------------------------------*/

app.post('/payment/ekle', async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      city,
      district,
      fullAddress,
      cardHolderName,
      cardNumber,
      cvv,
      expireDate,
      installmentOption,
      basketIds,
      userId
    } = req.body;

    // Zorunlu alan kontrolü
    if (
      !fullName || !phoneNumber || !city || !district || !fullAddress ||
      !cardHolderName || !cardNumber || !cvv || !expireDate || !installmentOption ||
      !basketIds || !Array.isArray(basketIds) || basketIds.length === 0 ||
      !userId
    ) {
      return res.status(400).json({ 
        message: "Tüm alanlar doldurulmalıdır ve en az bir sepet ürünü seçilmelidir." 
      });
    }

    // ObjectId olarak dönüştür
    const payment = new Payment({
      fullName,
      phoneNumber,
      city,
      district,
      fullAddress,
      cardHolderName,
      cardNumber,
      cvv,
      expireDate,
      installmentOption,
      basketIds: basketIds.map(id => new mongoose.Types.ObjectId(id)),
      userId: new mongoose.Types.ObjectId(userId)
    });

    const savedPayment = await payment.save();

    res.status(201).json({ message: "Ödeme kaydedildi", payment: savedPayment });
  } catch (error) {
    console.error("Ödeme ekleme hatası:", error);
    res.status(500).json({ message: "Ödeme kaydedilemedi", error: error.message });
  }
});

// Tüm ödemeleri listele
app.get('/payment/listele', async (req, res) => {
  try {
    // Payment modeli
    const Payment = require('./models/payment.model.js');

    // Tüm ödemeleri çek ve basketIds ile product bilgilerini populate et
    const payments = await Payment.find()
      .populate({
        path: 'basketIds',
        populate: {
          path: 'productId', // Basket içindeki productId bilgilerini çek
          select: 'name price imageUrl'
        }
      })
      .populate('userId', 'firstName lastName email') // Kullanıcı bilgilerini çek
      .exec();

    res.status(200).json(payments);
  } catch (error) {
    console.error("Ödeme listeleme hatası:", error);
    res.status(500).json({ message: "Ödemeler alınamadı", error: error.message });
  }
});


