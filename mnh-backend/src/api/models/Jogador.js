const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Jogador = sequelize.define('Jogador', {
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
  instagram: {
    type: DataTypes.STRING(255),
  },
  telefone: {
    type: DataTypes.STRING(30),
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  criado_por: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuario', 
      key: 'id',
    },
  },
  atualizado_por: {
    type: DataTypes.INTEGER,
    references: {
      model: 'usuario',
      key: 'id',
    },
  }
}, {
  tableName: 'jogador',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
});

module.exports = Jogador;
