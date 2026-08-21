const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JogadorPresenca = sequelize.define('JogadorPresenca', {
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
  data_presenca: {
    type: DataTypes.DATEONLY,
    allowNull: false,
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
  tableName: 'jogador_presenca',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
  indexes: [
    {
      unique: true,
      fields: ['id_jogador', 'data_presenca'],
      name: 'jogador_presenca_id_jogador_data_presenca_key',
    },
  ],
});

module.exports = JogadorPresenca;
