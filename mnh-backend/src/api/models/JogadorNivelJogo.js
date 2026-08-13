const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JogadorNivelJogo = sequelize.define('JogadorNivelJogo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_jogador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jogador',
      key: 'id',
    },
  },
  id_nivel_jogo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'nivel_jogo',
      key: 'id',
    },
  },
}, {
  tableName: 'jogador_nivel_jogo',
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_jogador', 'id_nivel_jogo'],
      name: 'jogador_nivel_jogo_id_jogador_id_nivel_jogo_key',
    },
  ],
});

module.exports = JogadorNivelJogo;
