const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Truck = require('../app/Models/Truck');
const TruckRepository = require('../app/Repositories/TruckRepository');
const MaintenanceRule = require('../app/Models/MaintenanceRule');
const MaintenanceRuleRepository = require('../app/Repositories/MaintenanceRuleRepository');
const MaintenanceService = require('../app/Services/MaintenanceService');
const MaintenanceController = require('../app/Http/Controllers/MaintenanceController');

const router = express.Router();

const truckRepository = new TruckRepository(Truck);
const maintenanceRuleRepository = new MaintenanceRuleRepository(MaintenanceRule);
const maintenanceService = new MaintenanceService(truckRepository, maintenanceRuleRepository);
const maintenanceController = new MaintenanceController(maintenanceService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/alerts', maintenanceController.getAlerts);

module.exports = router;
