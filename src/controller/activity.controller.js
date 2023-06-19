const activityModel = require('../models/activities.model');

const activityController = {
  addActivity: (req, res) => {
    activityModel.addActivity(req.body, res);
  },

  viewActivity: (req, res) => {
    activityModel.viewActivity(req.body, res);
  },

  markAsDone: (req, res) => {
    activityModel.markAsDone(req.body, res);
  },

  isAuthorizedToDelete: (req, res) => {
    activityModel.isAuthorizedToDelete(req.body, res);
  },

  deleteActivity: (req, res) => {
    activityModel.deleteActivity(req.body, res);
  },

  editActivity: (req, res) => {
    activityModel.editActivity(req.body, res);
  },
};

module.exports = activityController;
