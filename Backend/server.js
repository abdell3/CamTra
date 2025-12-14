const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db.config');
const { notFound, errorHandler } = require('./app/Http/Middlewares/error.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const truckRoutes = require('./routes/truck.routes');
const trailerRoutes = require('./routes/trailer.routes');
const tireRoutes = require('./routes/tire.routes');
const maintenanceRuleRoutes = require('./routes/maintenance_rule.routes');
const tripRoutes = require('./routes/trip.routes');
const tripReportRoutes = require('./routes/trip-report.routes');
const statsRoutes = require('./routes/stats.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');

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

// 2. Traitement des données
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTE HEALTHCHECK (Obligation Docker Compose) ---

app.get('/api/health', (req, res) => {

    res.status(200).json({ status: 'API is healthy', time: new Date() });

});

// --- ROUTES D'AUTHENTIFICATION ---
app.use('/api/auth', authRoutes);
// --- ROUTES UTILISATEURS (ADMIN) ---
app.use('/api/users', userRoutes);
// --- ROUTES FLOTTE (ADMIN) ---
app.use('/api/trucks', truckRoutes);
app.use('/api/trailers', trailerRoutes);
// --- ROUTES PNEUS (ADMIN) ---
app.use('/api/tires', tireRoutes);
// --- ROUTES RÈGLES DE MAINTENANCE (ADMIN) ---
app.use('/api/maintenance-rules', maintenanceRuleRoutes);
// --- ROUTES TRIPS (ADMIN) ---
app.use('/api/trips', tripRoutes);
// --- ROUTES TRIP REPORTS (CHAUFFEUR/ADMIN) ---
app.use('/api/trip-reports', tripReportRoutes);
// --- ROUTES STATISTIQUES (ADMIN) ---
app.use('/api/stats', statsRoutes);
// --- ROUTES MAINTENANCE (ADMIN) ---
app.use('/api/maintenance', maintenanceRoutes);

// --- MIDDLEWARES D'ERREUR ---
app.use(notFound);
app.use(errorHandler);

// --- Lancement du Serveur ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
