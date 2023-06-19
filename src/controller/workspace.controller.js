const workspaceModel = require('../models/workspace.model');

const workspaceController = {
  addWorkspace: (req, res) => {
    workspaceModel.addWorkspace(req.body, res);
  },

  workspaceTypeDrop: (req, res) => {
    workspaceModel.workspaceTypeDrop(req.body, res);
  },

  viewWorkspace: (req, res) => {
    workspaceModel.viewWorkspace(req.body, res);
  },

  viewById: (req, res) => {
    workspaceModel.viewById(req.body, res);
  },

  addMembers: (req, res) => {
    workspaceModel.addMembers(req.body, res);
  },

  removeMember: (req, res) => {
    workspaceModel.removeMember(req.body, res);
  },

  editWorkspace: (req, res) => {
    workspaceModel.editWorkspace(req.body, res);
  },
};

module.exports = workspaceController;
