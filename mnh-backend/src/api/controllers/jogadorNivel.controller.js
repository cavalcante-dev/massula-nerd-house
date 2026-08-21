const jogadorNivelService = require('../services/jogadorNivel.service');
const { Jogador, Jogo } = require('../models');

exports.obterNivel = async (req, res) => {
  try {
    const { id_jogador, id_jogo } = req.params;
    const nivel = await jogadorNivelService.encontrarNivel(id_jogador, id_jogo);
    if (!nivel) return res.status(404).json({ erro: 'Nível não encontrado' });
    return res.json(nivel);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.listarNiveisPorJogador = async (req, res) => {
  try {
    const { id_jogador } = req.params;
    const niveis = await jogadorNivelService.encontrarNiveisPorJogador(id_jogador);
    return res.json(niveis);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.listarNiveisPorJogo = async (req, res) => {
  try {
    const { id_jogo } = req.params;
    const niveis = await jogadorNivelService.encontrarNiveisPorJogo(id_jogo);
    return res.json(niveis);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.definirNivel = async (req, res) => {
  try {
    const { id_jogador, id_jogo } = req.params;
    const { nivel } = req.body;
    const criado_por = req.usuario.id;
    if (!nivel || nivel < 1) return res.status(400).json({ erro: 'Nível deve ser >= 1' });

    // verificar se jogador e jogo existem
    const jogador = await Jogador.findByPk(id_jogador);
    const jogo = await Jogo.findByPk(id_jogo);
    if (!jogador || !jogo) return res.status(404).json({ erro: 'Jogador ou Jogo não encontrado' });

    const result = await jogadorNivelService.criarOuAtualizarNivel(id_jogador, id_jogo, nivel, criado_por);
    return res.status(200).json({ sucesso: true, nivel: result });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};