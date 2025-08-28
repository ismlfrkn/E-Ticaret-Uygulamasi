const uri = "mongodb+srv://furkan:2001@ticaretdb.gjedefn.mongodb.net/?retryWrites=true&w=majority&appName=TicaretDb";
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

// Promise tabanlı bağlantı
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Bağlantı başarılı 🚀"))
.catch(err => console.error("Bağlantı hatası:", err));

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors({
    credentials: true,
    origin: ["*"]
}));

const port = 5000;
app.listen(port, () => {
    console.log("Site http://localhost:" + port + " üzerinden ayağa kaldırıldı.");
});
