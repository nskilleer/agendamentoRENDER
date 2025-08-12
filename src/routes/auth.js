// server/src/routes/auth.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Rota de registro de novos usuários
router.post('/register', authController.register);

// Rota de login de usuários
router.post('/login', authController.login);

module.exports = router;