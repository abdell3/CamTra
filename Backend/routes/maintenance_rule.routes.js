const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const MaintenanceRule = require('../app/Models/MaintenanceRule');
const MaintenanceRuleRepository = require('../app/Repositories/MaintenanceRuleRepository');
const MaintenanceRuleService = require('../app/Services/MaintenanceRuleService');
const MaintenanceRuleController = require('../app/Http/Controllers/MaintenanceRuleController');

const router = express.Router();

const maintenanceRuleRepository = new MaintenanceRuleRepository(MaintenanceRule);
const maintenanceRuleService = new MaintenanceRuleService(maintenanceRuleRepository);
const maintenanceRuleController = new MaintenanceRuleController(maintenanceRuleService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/', maintenanceRuleController.getAll);
router.get('/:id', maintenanceRuleController.getById);
router.post('/', maintenanceRuleController.create);
router.put('/:id', maintenanceRuleController.update);
router.delete('/:id', maintenanceRuleController.delete);

module.exports = router;



