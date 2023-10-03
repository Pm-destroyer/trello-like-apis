const Sequelize = require('sequelize');
const connection = require('../connection');

const Projects = connection.define('projects', {
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
  project_admin: {
    field: 'project_admin',
    type: Sequelize.INTEGER,
  },
  status: {
    field: 'members',
    type: Sequelize.INTEGER,
  },
  start_date: {
    field: 'start_date',
    type: Sequelize.DATE,
  },
  end_date: {
    field: 'end_date',
    type: Sequelize.DATE,
  },
  est_max_costs: {
    field: 'est_max_costs',
    type: Sequelize.DOUBLE,
  },
  cost_type: {
    field: 'cost_type',
    type: Sequelize.STRING,
  },
});

module.exports = Projects;
