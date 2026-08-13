const { JogadorNivelJogo, NivelJogo, Jogo, Jogador } = require('../models');

const encontrarNivel = async (id_jogador, id_jogo) => {
  return await JogadorNivelJogo.findOne({
    where: { id_jogador },
    include: [{
      model: NivelJogo,
      as: 'nivelJogo',
      where: { id_jogo },
    }],
  });
};

const encontrarNiveisPorJogador = async (id_jogador) => {
  return await JogadorNivelJogo.findAll({
    where: { id_jogador },
    include: [{
      model: NivelJogo,
      as: 'nivelJogo',
      include: [{ model: Jogo, as: 'jogo', attributes: ['id', 'nome'] }],
    }],
  });
};

const encontrarNiveisPorJogo = async (id_jogo) => {
  return await NivelJogo.findAll({
    where: { id_jogo },
    include: [{
      model: JogadorNivelJogo,
      as: 'jogadoresNivel',
      include: [{ model: Jogador, as: 'jogador', attributes: ['id', 'nome'] }],
    }],
    order: [['nivel', 'DESC']],
  });
};

const criarOuAtualizarNivel = async (id_jogador, id_jogo, nivel) => {
  const [nivelJogo] = await NivelJogo.findOrCreate({
    where: { id_jogo, nivel },
    defaults: { id_jogo, nivel },
  });

  const [registro] = await JogadorNivelJogo.findOrCreate({
    where: { id_jogador, id_nivel_jogo: nivelJogo.id },
    defaults: { id_jogador, id_nivel_jogo: nivelJogo.id },
  });

  return registro;
};

module.exports = {
  encontrarNivel,
  encontrarNiveisPorJogador,
  encontrarNiveisPorJogo,
  criarOuAtualizarNivel,
};
