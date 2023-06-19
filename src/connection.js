const Sequelize = require('sequelize');

const config = require('./db.config');

const sequelize = new Sequelize(
  config.database.DATABASE,
  config.database.USER,
  config.database.PASSWORD,
  {
    host: config.database.HOST,
    dialect: config.database.dialect,
    operatorsAliases: 0,
    acquire: 60000,
    idle: 10000,
    logging: false,
    define: {
      timestamps: false,
    },
  }
);

module.exports = sequelize;
