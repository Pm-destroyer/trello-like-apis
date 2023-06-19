const userModel = require('../models/user.model');

const UserController = {
  addUser: (req, res) => {
    userModel.addUser(req.body, res);
  },

  loginUser: (req, res) => {
    userModel.loginUser(req.body, res);
  },

  getUserByToken: (req, res) => {
    userModel.getUserByToken(req.body, res);
  },

  viewUsers: (req, res) => {
    userModel.viewUsers(req.body, res);
  },
};

module.exports = UserController;
