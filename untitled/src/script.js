const API_URL = "/api/products";

let allProducts = [];

// ===============================
// LOAD PRODUCTS
// ===============================

async function load() {
  try {
    const response = await fetch(`${API_URL}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid products response");
    }

    allProducts = data;

    console.log("✅ Products loaded:", allProducts);

    render();

  } catch (error) {
    console.error("❌ Product loading error:", error);

    allProducts = [];

    render();
  }
}

// ===============================
// DISPLAY PRODUCTS
// ===============================

function render() {
  const grid =
    document.getElementById("products") ||
    document.getElementById("product-grid") ||
    document.querySelector(".products-grid");

  if (!grid) {
    console.error("❌ Product container not found");
    return;
  }

  grid.innerHTML = "";

  if (allProducts.length === 0) {
    grid.innerHTML = `
      <div style="padding:30px;text-align:center;width:100%;">
        <h3>No products available</h3>
        <p>New products will appear here when added.</p>
      </div>
    `;

    return;
  }

  allProducts.forEach((product) => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
      <img
        src="${escapeHTML(product.image || "")}"
        alt="${escapeHTML(product.name || "Product")}"
        onerror="this.style.display='none'"
      >

      <div class="product-info">

        <h3>
          ${escapeHTML(product.name || "Unnamed Product")}
        </h3>

        <p class="product-category">
          ${escapeHTML(product.category || "")}
        </p>

        <p class="product-price">
          KSh ${Number(product.price || 0).toLocaleString()}
        </p>

        ${
          product.description
            ? `<p>${escapeHTML(product.description)}</p>`
            : ""
        }

      </div>
    `;

    grid.appendChild(card);
  });
}

// ===============================
// SECURITY HELPER
// ===============================

function escapeHTML(value) {
  const div = document.createElement("div");

  div.textContent = value;

  return div.innerHTML;
}

// ===============================
// START
// ===============================

document.addEventListener("DOMContentLoaded", load);
