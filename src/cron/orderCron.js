const cron = require("node-cron");
const Order = require("../models/order"); 

cron.schedule("* * * * *", async () => {                 
  console.log("⏱️ Cron: checking paid orders...");       

  const oneMinuteAgo = new Date(Date.now() - 60 * 1000);   

  const orders = await Order.find({          
    status: "paid",
    paidAt: { $lte: oneMinuteAgo }
  });

  for (let order of orders) {
    order.status = "shipped";
    await order.save();
    console.log(`📦 Order ${order._id} shipped`);
  }
});