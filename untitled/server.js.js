const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not configured");
} else {
    mongoose
        .connect(MONGODB_URI)
        .then(() => console.log("✅ MongoDB Connected"))
        .catch((err) => console.error("❌ MongoDB Error:", err));
}

// Product model
const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, default: "" },
        image: { type: String, default: "" },
        description: { type: String, default: "" }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

// Get all products
app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to load products" });
    }
});

// Add product
app.post("/api/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Admin route - also accepts product creation
app.post("/api/admin/products", async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Delete product
app.delete("/api/products/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

// Serve website files
app.use(express.static(path.join(__dirname, "src")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

// Start server
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
