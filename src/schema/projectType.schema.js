const Sequelize = require('sequelize');
const connection = require('../connection');

const workspaceTypes = connection.define('project_types', {
  id: {
    field: 'id',
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  short_name: {
    field: 'short_name',
    type: Sequelize.STRING,
  },
});

module.exports = workspaceTypes;
