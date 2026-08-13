const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partida = sequelize.define('Partida', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  id_jogo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jogo',
      key: 'id',
    },
  },
  id_nivel_jogo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'nivel_jogo',
      key: 'id',
    },
  },
  jogada_em: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'partida',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
});

module.exports = Partida;
