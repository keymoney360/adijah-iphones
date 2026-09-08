const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = "adijah2026";
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));
const productsFile = path.join(__dirname, 'products.json');
const ordersFile = path.join(__dirname, 'orders.json');
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(productsFile, JSON.stringify([
    { id: 1, name: "iPhone 15 Pro Max", category: "iphones", price: 1199, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "iPhone 14", category: "iphones", price: 699, image: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&w=400&q=80" }
  ], null, 2));
}
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
function checkAdmin(req, res, next) {
  const pwd = req.headers['x-admin-password'] || req.body.password;
  if (pwd === ADMIN_PASSWORD) return next();
  return res.status(401).json({ success: false });
}
app.get('/api/products', (req, res) => res.json(JSON.parse(fs.readFileSync(productsFile, 'utf8'))));
app.post('/api/admin/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) res.json({ success: true });
  else res.status(401).json({ success: false });
});
app.get('/api/admin/orders', checkAdmin, (req, res) => res.json(JSON.parse(fs.readFileSync(ordersFile, 'utf8'))));
app.post('/api/admin/products', checkAdmin, (req, res) => {
  fs.writeFileSync(productsFile, JSON.stringify(req.body.products, null, 2));
  res.json({ success: true });
});
app.post('/api/checkout', (req, res) => {
  const { customer, items, total } = req.body;
  const order = { id: 'ADJ-' + Date.now(), customer, items, total, date: new Date().toISOString() };
  const orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  console.log("--> New Order:", order.id);
  res.json({ success: true, orderId: order.id });
});
app.get('/admin', (req, res) => {
  const adminPath = path.join(__dirname, 'src', 'admin.html');
  if (fs.existsSync(adminPath)) {
    return res.sendFile(adminPath);
  } else {
    return res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Adijah Admin</title><style>body{font-family:Arial;background:#111;color:#fff;padding:20px}input,button{padding:10px;margin:5px;border-radius:6px;border:none}input{width:250px}.card{background:#222;padding:15px;border-radius:10px;margin:10px 0}button{background:#ff6a00;color:#fff;cursor:pointer;font-weight:bold}table{width:100%;border-collapse:collapse}td,th{padding:8px;border-bottom:1px solid #333}img{width:50px;height:50px;object-fit:cover;border-radius:6px}#panel{display:none}</style></head><body><h1>ADIJAH Admin Panel</h1><div id="login"><input type="password" id="pwd" placeholder="Enter admin password"><button onclick="login()">Login</button><p id="msg"></p></div><div id="panel"><h2>Products</h2><div class="card"><input id="n_name" placeholder="Name"><input id="n_price" type="number" placeholder="Price"><input id="n_image" placeholder="Image URL" style="width:300px"><button onclick="addProduct()">+ Add</button></div><table><thead><tr><th>Name</th><th>Price</th><th>Action</th></tr></thead><tbody id="list"></tbody></table><button onclick="saveAll()" style="background:#00c851;width:100%;padding:15px">SAVE</button><h2>Orders</h2><div id="orders"></div></div><script>let products=[],pwd="";async function login(){pwd=document.getElementById('pwd').value;let r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pwd})});if(r.ok){localStorage.setItem('adijah_pwd',pwd);showPanel();}else document.getElementById('msg').innerText="Wrong";}async function showPanel(){document.getElementById('login').style.display='none';document.getElementById('panel').style.display='block';pwd=localStorage.getItem('adijah_pwd');let res=await fetch('/api/products');products=await res.json();render();loadOrders();}function render(){let h="";products.forEach((p,i)=>{h+=\`<tr><td><input value="\${p.name}" onchange="products[\${i}].name=this.value"></td><td><input type="number" value="\${p.price}" onchange="products[\${i}].price=Number(this.value)"></td><td><button onclick="products.splice(\${i},1);render()" style="background:red">Delete</button></td></tr>\`;});document.getElementById('list').innerHTML=h;}function addProduct(){products.push({id:Date.now(),name:document.getElementById('n_name').value,price:Number(document.getElementById('n_price').value),image:document.getElementById('n_image').value||'',category:'iphones'});render();}async function saveAll(){let r=await fetch('/api/admin/products',{method:'POST',headers:{'Content-Type':'application/json','x-admin-password':pwd},body:JSON.stringify({products,password:pwd})});alert(r.ok?'Saved!':'Failed');}async function loadOrders(){let r=await fetch('/api/admin/orders',{headers:{'x-admin-password':pwd}});let o=await r.json();document.getElementById('orders').innerHTML=o.map(x=>\`<div class="card">\${x.id} - \${x.customer.name} - \$\${x.total}</div>\`).join('');}if(localStorage.getItem('adijah_pwd'))showPanel();<\/script></body></html>`);
  }
});
app.get('/*splat', (req, res) => res.sendFile(path.join(__dirname, 'src', 'index.html')));
app.listen(PORT, () => console.log(`Running http://localhost:${PORT} Admin /admin Pass ${ADMIN_PASSWORD}`));