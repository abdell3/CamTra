const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Tire = require('../app/Models/Tire');
const TireRepository = require('../app/Repositories/TireRepository');
const TruckRepository = require('../app/Repositories/TruckRepository');
const TrailerRepository = require('../app/Repositories/TrailerRepository');
const Truck = require('../app/Models/Truck');
const Trailer = require('../app/Models/Trailer');
const TireService = require('../app/Services/TireService');
const TireController = require('../app/Http/Controllers/TireController');

const router = express.Router();

const tireRepository = new TireRepository(Tire);
const truckRepository = new TruckRepository(Truck);
const trailerRepository = new TrailerRepository(Trailer);
const tireService = new TireService(tireRepository, truckRepository, trailerRepository);
const tireController = new TireController(tireService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/', tireController.getAll);
router.get('/:id', tireController.getById);
router.post('/', tireController.create);
router.delete('/:id', tireController.delete);
router.post('/:id/mount', tireController.mount);
router.post('/:id/dismount', tireController.dismount);

module.exports = router;

