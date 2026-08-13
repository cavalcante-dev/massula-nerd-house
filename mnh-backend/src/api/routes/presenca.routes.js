const express = require('express');

const router = express.Router();
const presencasController = require('../controllers/presencas.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/registrar/:id_jogador', authMiddleware, presencasController.registrarPresenca);
router.get('/listar', authMiddleware, presencasController.listarPresencas);

module.exports = router;
