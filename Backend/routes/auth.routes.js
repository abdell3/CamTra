const express = require('express');
const User = require('../app/Models/User');
const UserRepository = require('../app/Repositories/UserRepository');
const AuthService = require('../app/Services/AuthService');
const AuthController = require('../app/Http/Controllers/AuthController');

const router = express.Router();

const userRepository = new UserRepository(User);
const authService = new AuthService(userRepository, User);
const authController = new AuthController(authService);

router.post('/register', authController.handleRegister);
router.post('/login', authController.handleLogin);
router.post('/refresh', authController.handleRefreshToken);

module.exports = router;

