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
});

module.exports = Users;
