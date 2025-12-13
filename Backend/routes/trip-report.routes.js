const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const TripReport = require('../app/Models/TripReport');
const TripReportRepository = require('../app/Repositories/TripReportRepository');
const TripReportService = require('../app/Services/TripReportService');
const TripReportController = require('../app/Http/Controllers/TripReportController');
const Trip = require('../app/Models/Trip');
const TripRepository = require('../app/Repositories/TripRepository');
const Truck = require('../app/Models/Truck');
const TruckRepository = require('../app/Repositories/TruckRepository');
const Trailer = require('../app/Models/Trailer');
const TrailerRepository = require('../app/Repositories/TrailerRepository');

const router = express.Router();

const tripReportRepository = new TripReportRepository(TripReport);
const tripRepository = new TripRepository(Trip);
const truckRepository = new TruckRepository(Truck);
const trailerRepository = new TrailerRepository(Trailer);
const tripReportService = new TripReportService(tripReportRepository, tripRepository, truckRepository, trailerRepository);
const tripReportController = new TripReportController(tripReportService);

// Route pour les chauffeurs (création de rapport)
router.post('/', checkAuth, checkRole(['Chauffeur']), tripReportController.create);

// Routes pour les admins
router.use(checkAuth, checkRole(['Admin']));

router.get('/', tripReportController.getAll);
router.get('/:tripId', tripReportController.getByTripId);

module.exports = router;
