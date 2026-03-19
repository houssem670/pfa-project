const express = require("express");                          
const cors = require("cors");   

const app = express();      

// Middlewares globaux
app.use(cors()); 
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));    
app.use("/api/products", require("./routes/productRoutes")); 
app.use("/api/orders", require("./routes/orderRoutes")); 


module.exports = app; 