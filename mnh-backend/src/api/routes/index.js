const express = require('express');

const router = express.Router();

const authRoutes = require('./auth.routes');
const usuarioRoutes = require('./usuario.routes');
const jogadorRoutes = require('./jogador.routes');
const jogoRoutes = require('./jogo.routes');
const presencaRoutes = require('./presenca.routes');
const partidaRoutes = require('./partida.routes');
const jogadorNivelRoutes = require('./jogadorNivel.routes');

router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/usuario', usuarioRoutes);
router.use('/jogador', jogadorRoutes);
router.use('/jogo', jogoRoutes);
router.use('/presenca', presencaRoutes);
router.use('/partida', partidaRoutes);
router.use('/jogador-nivel', jogadorNivelRoutes);

module.exports = router;
