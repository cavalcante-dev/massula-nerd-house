const { Partida, Jogo, NivelJogo, PartidaResultado, Jogador } = require('../models');
const { Op } = require('sequelize');

const encontrarPartida = async (id) => {
  return await Partida.findByPk(id, {
    include: [
      { model: Jogo, as: 'jogo', attributes: ['id', 'nome'] },
      { model: NivelJogo, as: 'nivelJogo', attributes: ['id', 'nivel', 'modelo'] },
    ],
  });
};

const listarPartidas = async (filtros = {}) => {
  const where = {};
  if (filtros.id_jogo) where.id_jogo = filtros.id_jogo;
  if (filtros.id_nivel_jogo) where.id_nivel_jogo = filtros.id_nivel_jogo;
  if (filtros.jogada_em_inicio && filtros.jogada_em_fim) {
    where.jogada_em = { [Op.between]: [filtros.jogada_em_inicio, filtros.jogada_em_fim] };
  }
  return await Partida.findAll({
    where,
    include: [
      { model: Jogo, as: 'jogo' },
      { model: NivelJogo, as: 'nivelJogo' },
    ],
    order: [['jogada_em', 'DESC']],
  });
};

const criarPartida = async (dados) => {
  const { id_jogo, nivel, jogada_em } = dados;

  const [nivelJogo] = await NivelJogo.findOrCreate({
    where: { id_jogo, nivel },
    defaults: { id_jogo, nivel },
  });

  return await Partida.create({
    id_jogo,
    id_nivel_jogo: nivelJogo.id,
    jogada_em,
  });
};

const atualizarPartida = async (id, dados) => {
  const partida = await encontrarPartida(id);
  if (!partida) throw new Error('Partida não encontrada');
  await partida.update(dados);
  return partida;
};

const removerPartida = async (id) => {
  const partida = await encontrarPartida(id);
  if (!partida) throw new Error('Partida não encontrada');
  await partida.destroy();
};

const obterRankingPartida = async (id_partida) => {
  return await PartidaResultado.findAll({
    where: { id_partida },
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome'] }],
    order: [['posicao_final', 'ASC']],
  });
};

module.exports = {
  encontrarPartida,
  listarPartidas,
  criarPartida,
  atualizarPartida,
  removerPartida,
  obterRankingPartida,
};
