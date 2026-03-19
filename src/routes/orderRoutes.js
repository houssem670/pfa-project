const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

// Client
router.post("/", protect, orderController.createOrder);  
router.get("/my", protect, orderController.getMyOrders);
router.put("/:id/pay", protect, orderController.payOrder); 

// Admin                                                   
router.get("/", protect, isAdmin, orderController.getAllOrders);

module.exports = router;