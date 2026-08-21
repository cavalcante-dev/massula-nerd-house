const { JogadorPresenca, Jogador } = require('../models');
const { Op } = require('sequelize');

const contarPresencasPorJogador = async (id_jogador) => {
  return await JogadorPresenca.count({ where: { id_jogador } });
};

const verificarPresencaNaData = async (id_jogador, data_presenca) => {
  const presenca = await JogadorPresenca.findOne({
    where: { id_jogador, data_presenca },
  });
  return !!presenca;
};

const registrarNovaPresenca = async (id_jogador, data_presenca, criado_por, transaction = null) => {
  return await JogadorPresenca.create({ id_jogador, data_presenca, criado_por }, { transaction });
};

const listarPresencasPorPeriodo = async (inicio, fim) => {
  return await JogadorPresenca.findAll({
    where: { data_presenca: { [Op.between]: [inicio, fim] } },
    include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome'] }],
    order: [['data_presenca', 'ASC']],
  });
};

module.exports = {
  contarPresencasPorJogador,
  verificarPresencaNaData,
  registrarNovaPresenca,
  listarPresencasPorPeriodo,
};
