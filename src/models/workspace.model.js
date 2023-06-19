const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const workspaceSchema = require('../schema/workspace.schema');
const workspaceTypeSchema = require('../schema/workspaceType.schema');
const userSchema = require('../schema/user.schema');

workspaceSchema.belongsTo(workspaceTypeSchema, {
  foreignKey: 'type',
});

workspaceSchema.belongsTo(userSchema, {
  foreignKey: 'userId',
});

const WorkspaceModel = {
  addWorkspace: async (req, res) => {
    try {
      await workspaceSchema
        .create(req)
        .then((result) => {
          if (result) {
            res.send(result);
          } else res.send(0);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  workspaceTypeDrop: async (req, res) => {
    try {
      await workspaceTypeSchema
        .findAll({
          attributes: ['id', 'type'],
        })
        .then((result) => res.send(result))
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  viewWorkspace: async (req, res) => {
    try {
      await workspaceSchema
        .findAll({
          where: {
            [Op.or]: [
              { userId: req.userId },
              {
                members: { [Op.like]: `%${req.userId}%` },
              },
            ],
          },
          attributes: [[Sequelize.literal('MD5(id)'), 'id'], 'name', 'userId'],
        })
        .then((result) => res.send(result));
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  viewById: async (req, res) => {
    try {
      await workspaceSchema
        .findOne({
          where: {
            id: Sequelize.where(
              Sequelize.literal(`MD5(workspaces.id)`),
              req.id
            ),
          },
          attributes: [
            [Sequelize.literal('MD5(workspaces.id)'), 'id'],
            'name',
            'description',
            'type',
            'userId',
            'members',
          ],
          include: [
            {
              model: workspaceTypeSchema,
            },
            {
              model: userSchema,
              attributes: ['id', 'username'],
            },
          ],
        })
        .then(async (result) => {
          if (result) {
            if (result.dataValues.members !== null) {
              await userSchema
                .findAll({
                  where: {
                    id: { [Op.in]: result.dataValues.members.split(',') },
                  },
                  attributes: ['id', 'username'],
                })
                .then((users) => {
                  result.dataValues.memberLists = users;
                  res.send(result);
                });
            } else {
              result.dataValues.users = [];
              res.send(result);
            }
          } else {
            res.send(result);
          }
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  addMembers: async (req, res) => {
    try {
      await workspaceSchema
        .update(
          { members: req.addedMembers + req.members.join(',') + ',' },
          {
            where: {
              [Op.and]: [{ userId: req.userId }, { id: req.workspaceId }],
            },
          }
        )
        .then((result) => {
          res.send(result);
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  removeMember: async (req, res) => {
    try {
      await workspaceSchema
        .update(
          { members: req.members.join(',') + ',' },
          {
            where: {
              [Op.and]: [{ userId: req.userId }, { id: req.workspaceId }],
            },
          }
        )
        .then((result) => {
          res.send(result);
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  editWorkspace: async (req, res) => {
    try {
      await workspaceSchema
        .update(
          { name: req.name },
          {
            where: {
              id: Sequelize.where(
                Sequelize.literal(`MD5(workspaces.id)`),
                req.id
              ),
            },
          }
        )
        .then((result) => {
          if (result) {
            res.send(result);
          } else res.send(0);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },
};

module.exports = WorkspaceModel;
