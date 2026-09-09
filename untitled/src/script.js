const API_URL = "https://adijah-iphones-api.onrender.com/api/products";
let allProducts = [];

async function load(){
  try{
    let r = await fetch(API_URL);
    if(!r.ok) throw new Error("API sleeping");
    let data = await r.json();
    if(Array.isArray(data) && data.length>0){
      allProducts = data;
      // Fix OFFLINE text to ONLINE
      document.body.innerHTML = document.body.innerHTML
        .replaceAll("● OFFLINE MODE - Using backup","● ONLINE - Live ✅")
        .replaceAll("OFFLINE MODE - Using backup","● ONLINE - Live ✅")
        .replaceAll("OFFLINE MODE","ONLINE");
    }
  }catch(e){ 
    console.log("API error, using backup", e);
    // backup products so page not empty
    allProducts = [
      {id:1,name:"iPhone 15 Pro Max 256GB",price:185000,category:"iphones",image:"https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500"},
      {id:2,name:"iPhone 14 128GB",price:95000,category:"iphones",image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"}
    ];
  }
  render();
}

function render(){
  // try to find products container
  let grid = document.getElementById("products") || document.getElementById("product-grid") || document.querySelector(".products-grid");
  if(!grid){
    grid = document.createElement("div");
    grid.id = "products";
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:15px;padding:20px;";
    // add after welcome section
    let welcome = document.querySelector("h1") || document.body;
    welcome.parentNode.appendChild(grid);
  }
  grid.innerHTML = allProducts.map(p=>`
    <div style="background:#111;border-radius:12px;padding:12px;color:white">
      <img src="${p.image}" style="width:100%;height:150px;object-fit:cover;border-radius:8px" onerror="this.src='https://via.placeholder.com/200'"/>
      <h4 style="margin:8px 0;font-size:14px">${p.name}</h4>
      <p style="color:#ff7a00;font-weight:bold">KSh ${Number(p.price).toLocaleString()}</p>
      <button onclick="addToCart(${p.id})" style="background:#ff7a00;border:none;padding:8px;width:100%;border-radius:20px;cursor:pointer">Add to Cart</button>
    </div>
  `).join('');
}

function addToCart(id){
  let item = allProducts.find(p=>p.id==id);
  alert(item.name + " added!");
  // save cart
  let cart = JSON.parse(localStorage.getItem("cart")||"[]");
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", load);
load();
