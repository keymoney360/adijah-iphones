const API_URL = "https://adijah-iphones-api.onrender.com/api/products";

let allProducts = [
  {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
  {id:2,name:"iPhone 14 128GB",price:95000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
  {id:3,name:"iPad Pro 12.9 256GB",price:145000,category:"tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"},
  {id:4,name:"Apple Watch Series 9",price:55000,category:"watches",image:"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"}
];

let cart = JSON.parse(localStorage.getItem('mukatsoo_cart')||'[]');
let currentFilter = 'all';

async function init(){
  try {
    const res = await fetch(API_URL);
    if(res.ok){
      const data = await res.json();
      if(Array.isArray(data) && data.length>0){
        allProducts = data;
        // FIX OFFLINE BADGE - MAKE IT ONLINE
        document.querySelectorAll('*').forEach(el=>{
          if(el.textContent && el.textContent.includes('OFFLINE MODE')){
            el.innerHTML = '● ONLINE - Live from Mukatsoo API ✅';
            el.style.color = '#00ff88';
          }
        });
      }
    }
  } catch(e){
    console.log("API offline, using backup", e);
  }
  renderProducts();
  updateCartCount();
}

function renderProducts(){
  const container = document.getElementById('products') || document.querySelector('.products-grid') || document.body;
  let filtered = currentFilter==='all' ? allProducts : allProducts.filter(p=>p.category===currentFilter);
  
  let grid = document.getElementById('products-grid');
  if(!grid){
    // find where to inject
    grid = document.createElement('div');
    grid.id='products-grid';
    grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;padding:20px;';
    document.body.appendChild(grid);
  }
  
  grid.innerHTML = filtered.map(p=>`
    <div style="background:#1a1a1a;border-radius:15px;padding:15px;color:white">
      <img src="${p.image}" style="width:100%;height:200px;object-fit:cover;border-radius:10px" />
      <h3 style="margin:10px 0">${p.name}</h3>
      <p style="color:#ff7a00;font-weight:bold">KSh ${p.price.toLocaleString()}</p>
      <button onclick="addToCart(${p.id})" style="background:#ff7a00;border:none;padding:10px 20px;border-radius:20px;width:100%;cursor:pointer">Add to Cart</button>
    </div>
  `).join('');
}

function filterProducts(cat){
  currentFilter = cat;
  renderProducts();
  // update active button
  document.querySelectorAll('button').forEach(b=>{
    if(b.textContent.toLowerCase().includes(cat) || (cat==='all' && b.textContent.includes('All'))) {
      b.style.background='#ff7a00';
    }
  });
}

function addToCart(id){
  const product = allProducts.find(p=>p.id===id);
  cart.push(product);
  localStorage.setItem('mukatsoo_cart', JSON.stringify(cart));
  updateCartCount();
  alert(product.name + " added to cart!");
}

function updateCartCount(){
  const cartBtn = document.querySelector('[class*="cart"]') || document.getElementById('cart-count');
  const count = cart.length;
  // find Cart (0) button
  document.querySelectorAll('button').forEach(b=>{
    if(b.textContent.includes('Cart')){
      b.textContent = `🛒 Cart (${count})`;
    }
  });
}

// Make functions global for HTML onclick
window.filterProducts = (cat) => { currentFilter=cat; renderProducts(); };
window.addToCart = addToCart;
window.filterCategory = filterProducts;

document.addEventListener('DOMContentLoaded', init);
init();
