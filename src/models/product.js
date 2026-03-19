const mongoose = require("mongoose");

const productSchema = new mongoose.Schema( //crée le schéma qui définit la structure d’un produit.
  {
    name: {  
      type: String,  
      required: [true, "Product name is required"],  
      trim: true, //Supprime les espaces inutiles
      minlength: 2,  
      maxlength: 100       
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],     
      min: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    category: {
      type: String,
      trim: true,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true       
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index pour recherches fréquentes
productSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model("Product", productSchema);