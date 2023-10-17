const Sequelize = require("sequelize");
const connection = require("../connection");

const activities = connection.define("currencyMaster", {
  id: {
    field: "id",
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  unit_name: {
    field: "unit_name",
    type: Sequelize.STRING,
  },
  unit_symbol: {
    field: "unit_symbol",
    type: Sequelize.STRING,
  },
  factor_to_inr: {
    field: "factor_to_inr",
    type: Sequelize.DOUBLE,
  },
});

module.exports = activities;
