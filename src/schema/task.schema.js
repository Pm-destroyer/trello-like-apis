const Sequelize = require('sequelize');
const connection = require('../connection');

const activities = connection.define('tasks', {
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
  activityId: {
    field: 'activityId',
    type: Sequelize.INTEGER,
  },
  userId: {
    field: 'userId',
    type: Sequelize.INTEGER,
  },
  status: {
    field: 'status',
    type: Sequelize.INTEGER,
  },
});

module.exports = activities;
