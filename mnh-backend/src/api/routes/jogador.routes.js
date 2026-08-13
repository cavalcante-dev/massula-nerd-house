const express = require('express');

const router = express.Router();
const jogadorController = require('../controllers/jogador.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Rotas públicas
router.post('/registrar', authMiddleware, jogadorController.registrar );
router.get('/listar', authMiddleware, jogadorController.listar );
router.get('/listar/:id', authMiddleware, jogadorController.obterPorID );
router.put('/atualizar/:id', authMiddleware, jogadorController.atualizar );
router.put('/desativar/:id', authMiddleware, jogadorController.desativar );
router.put('/reativar/:id', authMiddleware, jogadorController.reativar );
router.post('/registrarPresenca/:id', authMiddleware, jogadorController.registrarPresenca );

module.exports = router;