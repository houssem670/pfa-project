const Order = require("../models/order");
const Product = require("../models/product");
const axios = require("axios");

// 🟢 CREATE ORDER (SERVER CALCULATES EVERYTHING)
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item"
      });
    }

    let orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      if (!item.product || item.quantity <= 0) {
        return res.status(400).json({
          message: "Invalid product or quantity"
        });
      }

      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          message: "Product not available"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      totalPrice += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,   // snapshot
        price: product.price, // snapshot
        quantity: item.quantity
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalPrice
    });

    res.status(201).json(order);

  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
};

// 💳 PAY ORDER + DECREMENT STOCK
exports.payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order already processed"
      });
    }

    // 🔒 Décrémentation ATOMIQUE
    for (const item of order.items) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Stock insufficient for ${item.name}`  
        });
      }
    }

    // ✅ Paiement OK
    order.status = "paid";
    order.paidAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Payment successful",
      order
    });

  } catch (error) {
    res.status(500).json({
      message: "Payment failed",
      error: error.message
    });
  }
};
// 👤 USER ORDERS
exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
};

// 🔐 ADMIN ALL ORDERS
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "email role");
  res.status(200).json(orders);
};