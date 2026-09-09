const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ===============================
// MONGODB CONNECTION
// ===============================

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not set in Render Environment Variables");
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("✅ MongoDB Connected");
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Error:", error);
    });
}

// ===============================
// PRODUCT MODEL
// ===============================

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

// ===============================
// GET ALL PRODUCTS
// ===============================

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load products",
    });
  }
});

// ===============================
// ADD PRODUCT
// ===============================

app.post("/api/products", async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const product = await Product.create({
      name,
      price: Number(price),
      category,
      image: image || "",
      description: description || "",
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product",
    });
  }
});

// ===============================
// UPDATE PRODUCT
// ===============================

app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        price: Number(req.body.price),
        category: req.body.category,
        image: req.body.image || "",
        description: req.body.description || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

// ===============================
// DELETE PRODUCT
// ===============================

app.delete("/api/products/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ADJIAH iPhones API is running",
  });
});

// ===============================
// SERVE WEBSITE
// ===============================

app.use(express.static(path.join(__dirname, "src")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
