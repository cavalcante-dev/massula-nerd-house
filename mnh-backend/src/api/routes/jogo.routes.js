const express = require('express');

const router = express.Router();
const jogosController = require('../controllers/jogo.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const superMiddleware = require('../middlewares/verificarSuperAdmin');

// Rotas restritas ao super admin
router.post('/registrar', authMiddleware, superMiddleware, jogosController.registrar );
router.put('/atualizar/:id', authMiddleware, superMiddleware, jogosController.atualizar );
router.put('/desativar/:id', authMiddleware, superMiddleware, jogosController.desativar );
router.put('/reativar/:id', authMiddleware, superMiddleware, jogosController.reativar );

// Rotas acessíveis a qualquer usuário autenticado
router.get('/listar', authMiddleware, jogosController.listar );
router.get('/listar/:id', authMiddleware, jogosController.obterPorID );

module.exports = router;