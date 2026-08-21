const partidasService = require('../services/partidas.service');
const jogoService = require('../services/jogo.service');

exports.criarPartida = async (req, res) => {
  try {
    const { id_jogo, nivel, jogada_em } = req.body;
    const criado_por = req.usuario.id;

    if (!id_jogo || !nivel || !jogada_em) {
      return res.status(400).json({ erro: 'Campos obrigatórios: id_jogo, nivel, jogada_em.' });
    }

    const jogo = await jogoService.encontrarJogo(id_jogo);
    if (!jogo) {
      return res.status(404).json({ erro: `Jogo com id ${id_jogo} não encontrado.` });
    }

    const dataJogada = new Date(jogada_em);
    if (Number.isNaN(dataJogada.getTime())) {
      return res.status(400).json({ erro: 'Campo jogada_em deve ser uma data válida (ISO 8601).' });
    }

    const partida = await partidasService.criarPartida({ id_jogo, nivel, jogada_em: dataJogada, criado_por });
    return res.status(201).json(partida);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(409).json({ erro: 'Violação de chave estrangeira. Verifique se id_jogo existe.' });
    }
    return res.status(500).json({ erro: 'Erro ao criar partida.', codigo: err.message });
  }
};

exports.listarPartidas = async (req, res) => {
  try {
    const filtros = req.query;
    const partidas = await partidasService.listarPartidas(filtros);
    return res.json(partidas);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.obterPartida = async (req, res) => {
  try {
    const { id } = req.params;
    const partida = await partidasService.encontrarPartida(id);
    if (!partida) return res.status(404).json({ erro: 'Partida não encontrada' });
    return res.json(partida);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.atualizarPartida = async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;
    const atualizado_por = req.usuario.id;
    const partida = await partidasService.atualizarPartida(id, dados, atualizado_por);
    return res.json({ sucesso: true, partida });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.deletarPartida = async (req, res) => {
  try {
    const { id } = req.params;
    await partidasService.removerPartida(id);
    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.rankingPartida = async (req, res) => {
  try {
    const { id } = req.params;
    const ranking = await partidasService.obterRankingPartida(id);
    return res.json(ranking);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};