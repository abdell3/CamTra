const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Trip = require('../app/Models/Trip');
const TripRepository = require('../app/Repositories/TripRepository');
const TripService = require('../app/Services/TripService');
const TripController = require('../app/Http/Controllers/TripController');
const User = require('../app/Models/User');
const UserRepository = require('../app/Repositories/UserRepository');
const Truck = require('../app/Models/Truck');
const TruckRepository = require('../app/Repositories/TruckRepository');
const Trailer = require('../app/Models/Trailer');
const TrailerRepository = require('../app/Repositories/TrailerRepository');

const router = express.Router();

const tripRepository = new TripRepository(Trip);
const userRepository = new UserRepository(User);
const truckRepository = new TruckRepository(Truck);
const trailerRepository = new TrailerRepository(Trailer);
const tripService = new TripService(tripRepository, userRepository, truckRepository, trailerRepository);
const tripController = new TripController(tripService);

// Route pour les chauffeurs 
router.use(checkAuth);


router.get('/my-trips', checkRole(['Chauffeur']), tripController.getMyTrips);
router.patch('/:id/start', checkRole(['Chauffeur']), tripController.start);
// Route accessible aux Admins et Chauffeurs (PDF)
router.get('/:id/pdf', checkRole(['Admin', 'Chauffeur']), tripController.downloadMissionOrder);

// Middleware restrictif pour la suite (Admins seulement)
router.use(checkRole(['Admin']));

// Routes Admin (CRUD)
router.post('/', tripController.create);
router.get('/', tripController.getAll);
router.put('/:id', tripController.update);
router.delete('/:id', tripController.delete);

module.exports = router;

