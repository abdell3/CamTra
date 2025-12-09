const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

// Chargement des variables d'environnement si l'application n'est pas dans un conteneur Docker

// Docker Compose gère les variables directement.

dotenv.config();

// --- MIDDLEWARES DE BASE ---
// 1. SECURITE

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

// 2. Traitement des données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nous allons initialiser la connexion à la BDD ici après la création du fichier config/db.config.js

// const connectDB = require('./config/db.config');

// connectDB(); 



// --- ROUTE HEALTHCHECK (Obligation Docker Compose) ---

app.get('/api/health', (req, res) => {

    res.status(200).json({ status: 'API is healthy', time: new Date() });

});



// --- Lancement du Serveur ---

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {

    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

});
