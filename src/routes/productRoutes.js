const express = require("express"); 
const router = express.Router(); 

const productController = require("../controllers/productController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Client + Admin    
router.get("/", protect, productController.getProducts);    

// Admin seulement                                         
router.post("/", protect, isAdmin, productController.createProduct);     
router.put("/:id", protect, isAdmin, productController.updateProduct);
router.delete("/:id", protect, isAdmin, productController.deleteProduct);   

module.exports = router;        


