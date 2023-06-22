const taskModel = require('../models/task.model');

const taskController = {
  addTask: (req, res) => {
    taskModel.addTask(req.body, res);
  },

  viewTask: (req, res) => {
    taskModel.viewTask(req.body, res);
  },

  editTask: (req, res) => {
    taskModel.editTask(req.body, res);
  },

  deleteTask: (req, res) => {
    taskModel.deleteTask(req.body, res);
  },

  markAsDone: (req, res) => {
    taskModel.markAsDone(req.body, res);
  },
};

module.exports = taskController;
