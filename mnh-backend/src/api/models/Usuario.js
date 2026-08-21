const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
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
  nome_usuario: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'admin',
    validate: {
      isIn: [['superadmin', 'admin']],
    },
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  criado_por: {
    type: DataTypes.INTEGER,
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
  },
}, {
  tableName: 'usuario',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
});

module.exports = Usuario;
