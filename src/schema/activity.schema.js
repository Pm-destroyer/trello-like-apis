const Sequelize = require('sequelize');
const connection = require('../connection');

const activities = connection.define('activities', {
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
  description: {
    field: 'description',
    type: Sequelize.STRING,
  },
  boardId: {
    field: 'boardId',
    type: Sequelize.INTEGER,
  },
  userId: {
    field: 'userId',
    type: Sequelize.INTEGER,
  },
  active: {
    field: 'active',
    type: Sequelize.BOOLEAN,
  },
  lastModified: {
    field: 'lastModified',
    type: Sequelize.INTEGER,
  },
});

module.exports = activities;
