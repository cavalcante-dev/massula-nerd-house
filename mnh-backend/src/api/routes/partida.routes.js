const express = require('express');

const router = express.Router();
const partidasController = require('../controllers/partidas.controller');
const partidaJogadoresController = require('../controllers/partidaJogadores.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/registrar', authMiddleware, partidasController.criarPartida);
router.get('/listar', authMiddleware, partidasController.listarPartidas);
router.get('/listar/:id', authMiddleware, partidasController.obterPartida);
router.put('/atualizar/:id', authMiddleware, partidasController.atualizarPartida);
router.delete('/remover/:id', authMiddleware, partidasController.deletarPartida);
router.get('/:id/ranking', authMiddleware, partidasController.rankingPartida);

router.post(
  '/:id_partida/jogador/:id_jogador',
  authMiddleware,
  partidaJogadoresController.adicionarJogadorNaPartida,
);
router.get(
  '/:id_partida/jogadores',
  authMiddleware,
  partidaJogadoresController.listarParticipantes,
);
router.put(
  '/:id_partida/jogador/:id_jogador',
  authMiddleware,
  partidaJogadoresController.atualizarParticipante,
);
router.delete(
  '/:id_partida/jogador/:id_jogador',
  authMiddleware,
  partidaJogadoresController.removerParticipante,
);

module.exports = router;
