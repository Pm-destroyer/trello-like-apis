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

  manageVisibility: (req, res) => {
    taskModel.manageVisibility(req.body, res);
  },

  addedMembers: (req, res) => {
    taskModel.addedMembers(req.body, res);
  },

  addTaskPriority: (req, res) => {
    taskModel.addTaskPriority(req.body, res);
  },

  priorityList: (req, res) => {
    taskModel.priorityList(req.body, res);
  },
};

module.exports = taskController;
