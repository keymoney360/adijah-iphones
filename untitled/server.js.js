const express = require('express');
const path = require('path');
const cors = require('cors');
app.use(cors({ origin: "*" }));
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;
app.get("/", (req, res) => {
  res.send("Mukatsoo iPhones API is Running ✅ - Shop at Mukatsoo");
});
app.use(cors());
app.use(express.json({limit: '10mb'}));

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

const productsFile = path.join(__dirname, 'products.json');

if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([
    {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
    {id:2,name:"iPhone 14 128GB",price:95000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
    {id:3,name:"iPad Pro 12.9",price:145000,category:"tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"}
  ], null, 2));
}

app.get('/api/products', (req,res)=>{
  try{
    const data = JSON.parse(fs.readFileSync(productsFile,'utf8'));
    res.json(data);
  }catch(e){ res.json([]); }
});

app.post('/api/products', (req,res)=>{
  try{
    fs.writeFileSync(productsFile, JSON.stringify(req.body, null, 2));
    res.json({success:true, count: req.body.length});
  }catch(e){ res.status(500).json({error:e.message}); }
});

app.get('/', (req,res)=> res.sendFile(path.join(distPath,'index.html')));
app.get('/admin', (req,res)=> res.sendFile(path.join(distPath,'admin.html')));

app.listen(PORT, ()=> console.log('ADIJAH AUTO LIVE on '+PORT));
