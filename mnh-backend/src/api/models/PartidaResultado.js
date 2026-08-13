const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PartidaResultado = sequelize.define('PartidaResultado', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_partida: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'partida',
      key: 'id',
    },
  },
  id_jogador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jogador',
      key: 'id',
    },
  },
  estatisticas: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  posicao_final: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vencedor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  tableName: 'partida_resultado',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_partida', 'id_jogador'],
      name: 'partida_resultado_id_partida_id_jogador_key',
    },
  ],
});

module.exports = PartidaResultado;
