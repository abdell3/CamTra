const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db.config');
const { notFound, errorHandler } = require('./app/Http/Middlewares/error.middleware');

dotenv.config();

connectDB(); 
// --- MIDDLEWARES DE BASE ---
// 1. SECURITE

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(notFound);
app.use(errorHandler);

// 2. Traitement des données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTE HEALTHCHECK (Obligation Docker Compose) ---

app.get('/api/health', (req, res) => {

    res.status(200).json({ status: 'API is healthy', time: new Date() });

});

// --- Lancement du Serveur ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

});
