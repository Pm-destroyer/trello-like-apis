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
  userId: {
    field: 'userId',
    type: Sequelize.INTEGER,
  },
  status: {
    field: 'status',
    type: Sequelize.INTEGER,
  },
  priorityId: {
    field: 'priorityId',
    type: Sequelize.INTEGER,
  },
  project_id: {
    field: 'project_id',
    type: Sequelize.INTEGER,
  },
  created_by: {
    field: 'created_by',
    type: Sequelize.INTEGER,
  },
  estimated_hours: {
    field: 'estimated_hours',
    type: Sequelize.DOUBLE,
  },
  actual_hours: {
    field: 'actual_hours',
    type: Sequelize.DOUBLE,
  },
  start_date: {
    field: 'start_date',
    type: Sequelize.DATE,
  },
  end_date: {
    field: 'end_date',
    type: Sequelize.DATE,
  },
});

module.exports = activities;
