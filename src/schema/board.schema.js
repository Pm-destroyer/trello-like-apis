const Sequelize = require('sequelize');
const connection = require('../connection');

const boards = connection.define('boards', {
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
  projectId: {
    field: 'projectId',
    type: Sequelize.INTEGER,
  },
  userId: {
    field: 'userId',
    type: Sequelize.INTEGER,
  },
  members: {
    field: 'members',
    type: Sequelize.INTEGER,
  },
});

module.exports = boards;
