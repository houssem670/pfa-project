require("dotenv").config(); //charge les variables du fichier .env dans process.env
const app = require("./app"); //importe l’application Express configurée dans app.js
require("./cron/orderCron");
const client = require('prom-client')

const connectDB = require("./config/db"); //importe la fonction qui gère la connexion à MongoDB

connectDB(); //exécute la connexion au démarrage du serveur.

const PORT = process.env.PORT || 5000; 


// collect metrics system
client.collectDefaultMetrics()
// endpoint metrics


app.get('/', (req, res) => {
  res.send('App is running');
});
app.get('/metrics', async (req,res)=>{
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
}) 


// 👇 HEALTH CHECK POUR KUBERNETES
app.get('/health', (req, res) => {
  res.status(200).send('OK');
}); 


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});