const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Jogador = require('./Jogador');
const Jogo = require('./Jogo');
const NivelJogo = require('./NivelJogo');
const JogadorNivelJogo = require('./JogadorNivelJogo');
const Partida = require('./Partida');
const PartidaResultado = require('./PartidaResultado');
const JogadorPresenca = require('./JogadorPresenca');

// ===========================================
// ASSOCIAÇÕES (baseadas nas chaves estrangeiras do schema)
// ===========================================

// ---- NivelJogo ----
NivelJogo.belongsTo(Jogo, { foreignKey: 'id_jogo', as: 'jogo' });
Jogo.hasMany(NivelJogo, { foreignKey: 'id_jogo', as: 'niveis' });

// ---- JogadorNivelJogo ----
JogadorNivelJogo.belongsTo(Jogador, { foreignKey: 'id_jogador', as: 'jogador' });
JogadorNivelJogo.belongsTo(NivelJogo, { foreignKey: 'id_nivel_jogo', as: 'nivelJogo' });
Jogador.hasMany(JogadorNivelJogo, { foreignKey: 'id_jogador', as: 'niveis' });
NivelJogo.hasMany(JogadorNivelJogo, { foreignKey: 'id_nivel_jogo', as: 'jogadoresNivel' });

// ---- Partida ----
Partida.belongsTo(Jogo, { foreignKey: 'id_jogo', as: 'jogo' });
Partida.belongsTo(NivelJogo, { foreignKey: 'id_nivel_jogo', as: 'nivelJogo' });
Jogo.hasMany(Partida, { foreignKey: 'id_jogo', as: 'partidas' });

// ---- PartidaResultado ----
PartidaResultado.belongsTo(Partida, { foreignKey: 'id_partida', as: 'partida' });
PartidaResultado.belongsTo(Jogador, { foreignKey: 'id_jogador', as: 'jogador' });
Partida.hasMany(PartidaResultado, { foreignKey: 'id_partida', as: 'resultados' });
Jogador.hasMany(PartidaResultado, { foreignKey: 'id_jogador', as: 'resultados' });

// ---- JogadorPresenca ----
JogadorPresenca.belongsTo(Jogador, { foreignKey: 'id_jogador', as: 'jogador' });
Jogador.hasMany(JogadorPresenca, { foreignKey: 'id_jogador', as: 'presencas' });

// Exportar todos os modelos
module.exports = {
  sequelize,
  Usuario,
  Jogador,
  Jogo,
  NivelJogo,
  JogadorNivelJogo,
  Partida,
  PartidaResultado,
  JogadorPresenca,
};
