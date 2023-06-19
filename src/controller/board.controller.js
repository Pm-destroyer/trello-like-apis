const boardModel = require('../models/boards.model');

const boardController = {
  addBoard: (req, res) => {
    boardModel.addBoard(req.body, res);
  },

  viewBoard: (req, res) => {
    boardModel.viewBoard(req.body, res);
  },

  viewById: (req, res) => {
    boardModel.viewById(req.body, res);
  },

  editBoard: (req, res) => {
    boardModel.editBoard(req.body, res);
  },
};

module.exports = boardController;
