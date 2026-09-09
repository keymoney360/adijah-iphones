const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// FIX 1: CORS FIRST!
app.use(cors({
  origin: "*", // allow your shop
  methods: ["GET","POST","PUT","DELETE"]
}));
app.use(express.json({limit: '10mb'}));

const productsFile = path.join(__dirname, 'products.json');

// Create default products if not exist
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([
    {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
    {id:2,name:"iPhone 14 128GB",price:95000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
    {id:3,name:"iPad Pro 12.9",price:145000,category:"tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"}
  ], null, 2));
}

// API Routes
app.get("/", (req, res) => {
  res.send("Mukatsoo iPhones API is Running ✅ - Shop at Mukatsoo");
});

app.get('/api/products', (req,res)=>{
  try{
    const data = JSON.parse(fs.readFileSync(productsFile,'utf8'));
    res.json(data);
  }catch(e){ res.json([]); }
});

app.post('/api/products', (req,res)=>{
  try{
    // req.body should be FULL array
    fs.writeFileSync(productsFile, JSON.stringify(req.body, null, 2));
    res.json({success:true, count: req.body.length});
  }catch(e){ res.status(500).json({error:e.message}); }
});

// FIX 2: Admin link for your question
app.get('/admin', (req,res)=> {
  res.send(`
    <h1>Mukatsoo iPhones Admin</h1>
    <p>API is at <a href="/api/products">/api/products</a></p>
    <p>Your shop admin is: https://mukatsoo-iphones.onrender.com/admin</p>
    <p>To add products, use your shop admin panel, not this API page.</p>
  `);
});

app.listen(PORT, ()=> console.log('MUKATSOO API LIVE on '+PORT));
