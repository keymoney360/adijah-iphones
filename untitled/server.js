const API_URL = "https://adijah-iphones-api.onrender.com/api/products";

let allProducts = [
  {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
  {id:2,name:"iPhone 14 128GB",price:95000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
  {id:3,name:"iPad Pro 12.9",price:145000,category:"tablets",image:"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"},
  {id:4,name:"Apple Watch Series 9",price:55000,category:"watches",image:"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500"}
];

async function load(){
  try{
    let r = await fetch(API_URL);
    if(!r.ok) throw new Error("API down");
    let data = await r.json();
    if(Array.isArray(data) && data.length>0){
      allProducts = data;
      // Fix OFFLINE badge
      document.body.innerHTML = document.body.innerHTML
        .replaceAll("OFFLINE MODE - Using backup","ONLINE - Live API ✅")
        .replaceAll("OFFLINE MODE","ONLINE");
    }
  }catch(e){ 
    console.log("Using backup", e); 
  }
  render();
}

function render(){
  let grid = document.getElementById("products") || document.querySelector(".products") || document.querySelector("[class*=grid]");
  if(!grid){
    // create grid under welcome text
    grid = document.createElement("div");
    grid.id="products";
    grid.style.cssText="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px;padding:20px;";
    document.body.appendChild(grid);
  }
  grid.innerHTML = allProducts.map(p=>`
    <div style="background:#111;border-radius:12px;padding:10px;text-align:center">
      <img src="${p.image||'https://via.placeholder.com/200'}" style="width:100%;height:150px;object-fit:cover;border-radius:8px"/>
      <h4 style="color:white;font-size:14px;margin:8px 0">${p.name}</h4>
      <p style="color:#ff7a00;font-weight:bold">KSh ${Number(p.price).toLocaleString()}</p>
      <button onclick="alert('Added ${p.name}')" style="background:#ff7a00;border:none;padding:8px 12px;border-radius:20px;width:100%">Add to Cart</button>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", load);
load();
