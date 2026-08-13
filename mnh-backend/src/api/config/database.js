const { Sequelize } = require('sequelize');

const isDev = process.env.NODE_ENV !== 'production';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: isDev ? console.log : false,
  timezone: 'America/Sao_Paulo',
  dialectOptions: {
    connectTimeout: 10000, // 10 segundos
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX) || 10,
    min: Number(process.env.DB_POOL_MIN) || 0,
    acquire: 10000,
    idle: 10000,
  },
});

module.exports = sequelize;
