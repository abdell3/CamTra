const express = require('express');
const { checkAuth, checkRole } = require('../app/Http/Middlewares/auth.middleware');
const User = require('../app/Models/User');
const UserRepository = require('../app/Repositories/UserRepository');
const UserService = require('../app/Services/UserService');
const UserController = require('../app/Http/Controllers/UserController');

const router = express.Router();

const userRepository = new UserRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.use(checkAuth, checkRole(['Admin']));

router.get('/drivers', userController.getDrivers);
router.post('/drivers', userController.createDriver);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

