const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Trip = require('../app/Models/Trip');
const TripRepository = require('../app/Repositories/TripRepository');
const TripReport = require('../app/Models/TripReport');
const TripReportRepository = require('../app/Repositories/TripReportRepository');
const Truck = require('../app/Models/Truck');
const TruckRepository = require('../app/Repositories/TruckRepository');
const StatsService = require('../app/Services/StatsService');
const StatsController = require('../app/Http/Controllers/StatsController');

const router = express.Router();

const tripRepository = new TripRepository(Trip);
const tripReportRepository = new TripReportRepository(TripReport);
const truckRepository = new TruckRepository(Truck);
const statsService = new StatsService(tripRepository, tripReportRepository, truckRepository);
const statsController = new StatsController(statsService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/dashboard', statsController.getDashboardStats);

module.exports = router;
