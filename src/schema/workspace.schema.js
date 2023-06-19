const Sequelize = require('sequelize');
const connection = require('../connection');

const Workspaces = connection.define('workspaces', {
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
  type: {
    field: 'typeId',
    type: Sequelize.INTEGER,
  },
  description: {
    field: 'description',
    type: Sequelize.STRING,
  },
  userId: {
    field: 'userId',
    type: Sequelize.INTEGER,
  },
  members: {
    field: 'members',
    type: Sequelize.STRING,
  },
});

module.exports = Workspaces;
