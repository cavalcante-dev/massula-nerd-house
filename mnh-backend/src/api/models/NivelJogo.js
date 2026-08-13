const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NivelJogo = sequelize.define('NivelJogo', {
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
  nivel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING(255),
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'nivel_jogo',
  freezeTableName: true,
  updatedAt: 'atualizado_em',
  createdAt: 'criado_em',
  indexes: [
    {
      unique: true,
      fields: ['id_jogo', 'nivel'],
      name: 'nivel_jogo_id_jogo_nivel_key',
    },
  ],
});

module.exports = NivelJogo;
