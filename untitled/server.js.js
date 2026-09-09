const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({limit: '10mb'}));

const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

const productsFile = path.join(__dirname, 'products.json');
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([
    {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
    {id:2,name:"iPhone 15 Pro 128GB",price:165000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
    {id:3,name:"iPad Pro 12.9",price:145000,category:"tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"}
  ], null, 2));
}

app.get('/api/products', (req,res)=>{
  try{ res.json(JSON.parse(fs.readFileSync(productsFile,'utf8'))); }
  catch(e){ res.json([]); }
});

app.post('/api/products', (req,res)=>{
  fs.writeFileSync(productsFile, JSON.stringify(req.body, null, 2));
  res.json({success:true});
});

// FIX FOR /dist/ error - redirect to /
app.get('/dist', (req,res)=> res.redirect('/'));
app.get('/dist/', (req,res)=> res.redirect('/'));

// Admin routes
app.get('/admin', (req,res)=> res.sendFile(path.join(distPath,'admin.html')));
app.get('/admin.html', (req,res)=> res.sendFile(path.join(distPath,'admin.html')));
app.get('/dist/admin.html', (req,res)=> res.sendFile(path.join(distPath,'admin.html')));

app.get('*', (req,res)=> {
  if(req.path.startsWith('/api/')) return res.status(404).json({error:'Not found'});
  res.sendFile(path.join(distPath,'index.html'));
});

app.listen(PORT, ()=> console.log('ADIJAH LIVE on '+PORT));
