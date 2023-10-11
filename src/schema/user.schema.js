const Sequelize = require('sequelize');
const connection = require('../connection');

const Users = connection.define('users', {
  id: {
    field: 'id',
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    field: 'Username',
    type: Sequelize.STRING,
  },
  password: {
    field: 'password',
    type: Sequelize.STRING,
  },
  token: {
    field: 'token',
    type: Sequelize.STRING,
  },
  first_name: {
    field: 'first_name',
    type: Sequelize.STRING,
  },
  last_name: {
    field: 'last_name',
    type: Sequelize.STRING,
  },
  roleId: {
    field: 'roleId',
    type: Sequelize.STRING,
  },
});

module.exports = Users;
