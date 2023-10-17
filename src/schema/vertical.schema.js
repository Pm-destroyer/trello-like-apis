const Sequelize = require("sequelize");
const connection = require("../connection");

const activities = connection.define("vertical", {
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
  description: {
    field: "description",
    type: Sequelize.STRING,
  },
  short_name: {
    field: "short_name",
    type: Sequelize.STRING,
  },
  vertical_head_user_id: {
    field: "vertical_head_user_id",
    type: Sequelize.INTEGER,
  },
});

module.exports = activities;
