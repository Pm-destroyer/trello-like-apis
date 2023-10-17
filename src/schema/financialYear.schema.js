const Sequelize = require("sequelize");
const connection = require("../connection");

const activities = connection.define("financialYear", {
  id: {
    field: "id",
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    field: "name",
    type: Sequelize.STRING,
  },
  start_date: {
    field: "start_date",
    type: Sequelize.DATE,
  },
  end_date: {
    field: "end_date",
    type: Sequelize.DATE,
  },
  is_active: {
    field: "is_active",
    type: Sequelize.BOOLEAN,
  },
  is_current: {
    field: "is_current",
    type: Sequelize.BOOLEAN,
  },
});

module.exports = activities;
