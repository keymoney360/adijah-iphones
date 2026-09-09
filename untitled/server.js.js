const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // allow big images
mongodb+srv://kimaniiangithua_db_user:<db_password>@cluster0.zfamvdh.mongodb.net/?appName=Cluster0
// 1. CONNECT TO YOUR MONGODB
const MONGODB_URI = process.env.MONGODB_URI || "PASTE_YOUR_MONGODB_STRING_HERE";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// 2. PRODUCT MODEL
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,
  description: String
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

// 3. API ROUTES
app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

app.post('/api/products', async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
});

app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 4. SERVE YOUR FRONTEND (your current HTML)
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. START SERVER
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
