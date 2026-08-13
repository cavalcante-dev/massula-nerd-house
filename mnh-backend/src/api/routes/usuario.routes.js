const express = require('express');

const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const superMiddleware = require('../middlewares/verificarSuperAdmin');

// Rotas públicas
router.post('/registrar', authMiddleware, superMiddleware, usuarioController.registrar );
router.get('/listar', authMiddleware, superMiddleware, usuarioController.listar );
router.get('/listar/:id', authMiddleware, usuarioController.obterPorID );

module.exports = router;