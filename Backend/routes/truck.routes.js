const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Truck = require('../app/Models/Truck');
const TruckRepository = require('../app/Repositories/TruckRepository');
const TruckService = require('../app/Services/TruckService');
const TruckController = require('../app/Http/Controllers/TruckController');

const router = express.Router();

const truckRepository = new TruckRepository(Truck);
const truckService = new TruckService(truckRepository);
const truckController = new TruckController(truckService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/', truckController.getAll);
router.get('/:id', truckController.getById);
router.post('/', truckController.create);
router.put('/:id', truckController.update);
router.delete('/:id', truckController.delete);

module.exports = router;

