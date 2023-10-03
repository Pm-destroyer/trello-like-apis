const projectModel = require('../models/project.model');

const projectController = {
  addProject: (req, res) => {
    projectModel.addproject(req.body, res);
  },

  projectTypeDrop: (req, res) => {
    projectModel.projectTypeDrop(req.body, res);
  },

  viewProject: (req, res) => {
    projectModel.viewproject(req.body, res);
  },

  viewById: (req, res) => {
    projectModel.viewById(req.body, res);
  },

  addMembers: (req, res) => {
    projectModel.addMembers(req.body, res);
  },

  removeMember: (req, res) => {
    projectModel.removeMember(req.body, res);
  },

  editProject: (req, res) => {
    projectModel.editproject(req.body, res);
  },
};

module.exports = projectController;
