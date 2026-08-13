const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogo = sequelize.define('Jogo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  config_campos: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'jogo',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
});

module.exports = Jogo;
