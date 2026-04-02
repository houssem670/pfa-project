const Product = require("../models/product");
const axios = require("axios");

// Créer un produit
exports.createProduct = async (req, res) => { 
  try {
    const product = await Product.create(req.body);  //Crée un produit dans MongoDB avec les données du client
    res.status(201).json(product); 
  } catch (error) {  
    res.status(400).json({ message: error.message });          
  }                                                    
};               

// Lire tous les produits
exports.getProducts = async (req, res) => {  // exports pour dire que cette fct est public
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // 🚨 Alerte stock faible → n8n
    if (product.stock <= 10) {
      await axios.post(process.env.N8N_LOW_STOCK_URL, {
        productId: product._id,
        name: product.name,
        stock: product.stock 
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};