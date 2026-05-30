const express = require('express');
const router = express.Router();
const { registrar, login, registrarAdmin } = require('../controllers/authController');
const { proteger, admin } = require('../middleware/authMiddleware');

// Rotas de autenticação
router.post('/registrar', registrar);
router.post('/login', login);
router.post('/registrar-admin', proteger, admin, registrarAdmin);

module.exports = router;
