const jwt = require("jsonwebtoken"); //Importe la librairie jsonwebtoken pour vérifier et décoder les tokens JWT
const User = require("../models/user");  //Sert à récupérer l’utilisateur depuis MongoDB

// Vérifier le token JWT
exports.protect = async (req, res, next) => { 
  let token; //On crée une boîte vide pour mettre le token dedans  

  if (
    req.headers.authorization &&                          
    req.headers.authorization.startsWith("Bearer") //Bearer = “je porte un token” C’est un mot standard en HTTP pour dire quel type d’authentification tu utilises.
  ) {                                                    
    token = req.headers.authorization.split(" ")[1];         
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
    
  }
};

// Vérifier si admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admin only" });
  }
  next();
};