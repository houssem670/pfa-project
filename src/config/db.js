const mongoose = require("mongoose"); 

const connectDB = async () => {                            
  try { 
    await mongoose.connect(process.env.MONGO_URI);          
    console.log("MongoDB connected"); 
  } catch (error) { 
    console.error("MongoDB connection failed", error.message); 
    process.exit(1); //arrête l’application si la base ne fonctionne pas (sécurité)
  }    
};  

module.exports = connectDB;                                 