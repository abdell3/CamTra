const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const Trailer = require('../app/Models/Trailer');
const TrailerRepository = require('../app/Repositories/TrailerRepository');
const TrailerService = require('../app/Services/TrailerService');
const TrailerController = require('../app/Http/Controllers/TrailerController');

const router = express.Router();

const trailerRepository = new TrailerRepository(Trailer);
const trailerService = new TrailerService(trailerRepository);
const trailerController = new TrailerController(trailerService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/', trailerController.getAll);
router.get('/:id', trailerController.getById);
router.post('/', trailerController.create);
router.put('/:id', trailerController.update);
router.delete('/:id', trailerController.delete);

module.exports = router;

