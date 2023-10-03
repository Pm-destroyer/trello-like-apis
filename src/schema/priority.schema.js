const Sequelize = require('sequelize');
const connection = require('../connection');

const activities = connection.define('priorities', {
  id: {
    field: 'id',
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    field: 'name',
    type: Sequelize.STRING,
  },
});

module.exports = activities;
