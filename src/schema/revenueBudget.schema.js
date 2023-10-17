const Sequelize = require("sequelize");
const connection = require("../connection");

const activities = connection.define("revenueBudget", {
  id: {
    field: "id",
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  financial_year_id: {
    field: "financial_year_id",
    type: Sequelize.INTEGER,
  },
  vertical_id: {
    field: "vertical_id",
    type: Sequelize.INTEGER,
  },
  period_type: {
    field: "period_type",
    type: Sequelize.ENUM,
  },
  period_value: {
    field: "period_type",
    type: Sequelize.STRING,
  },
  period_start: {
    field: "period_type",
    type: Sequelize.DATE,
  },
  period_end: {
    field: "period_type",
    type: Sequelize.DATE,
  },
  parent_item_id: {
    field: "parent_item_id",
    type: Sequelize.INTEGER,
  },
  budget_value: {
    field: "budget_value",
    type: Sequelize.FLOAT,
  },
  currency_id: {
    field: "period_type",
    type: Sequelize.INTEGER,
  },
});

module.exports = activities;
