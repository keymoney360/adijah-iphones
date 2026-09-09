const API_URL = "https://adijah-iphones-api.onrender.com/api/products";
let allProducts = [];
async function load(){
  try{
    let r = await fetch(API_URL);
    let data = await r.json();
    if(data.length>0){
      allProducts=data;
      let el=document.querySelector("p");
      document.body.innerHTML=document.body.innerHTML.replace("OFFLINE MODE - Using backup","● ONLINE - Live ✅").replace("● OFFLINE MODE - Using backup","● ONLINE - Live ✅");
    }
  }catch(e){ console.log(e) }
}
load();
