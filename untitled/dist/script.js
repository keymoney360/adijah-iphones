// LOAD PRODUCTS FOR CUSTOMERS
async function loadProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();
  // ... your code to show products
  console.log(products);
}

// SAVE PRODUCT FROM ADMIN
async function saveProduct(product) {
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  alert("Product saved to real database!");
}
