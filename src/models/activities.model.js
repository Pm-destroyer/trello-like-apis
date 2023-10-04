const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const crypto = require('crypto');

const activitySchema = require('../schema/activity.schema');
const boardSchema = require('../schema/board.schema');
const projectSchema = require('../schema/project.schema');
const userSchema = require('../schema/user.schema');

activitySchema.belongsTo(boardSchema, {
  foreignKey: 'boardId',
});

activitySchema.belongsTo(userSchema, {
  foreignKey: 'userId',
  as: 'user',
});

activitySchema.belongsTo(userSchema, {
  foreignKey: 'lastModified',
  as: 'lastModifiedBy',
});

boardSchema.belongsTo(projectSchema, {
  foreignKey: 'projectId',
});

const activityModel = {
  addActivity: async (req, res) => {
    try {
      await boardSchema
        .findOne({
          where: {
            id: Sequelize.where(Sequelize.literal('MD5(id)'), req.boardId),
          },
          attributes: ['id'],
        })
        .then(async (board) => {
          req.boardId = board.dataValues.id;

          await activitySchema
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
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  viewActivity: async (req, res) => {
    try {
      await activitySchema
        .findAll({
          where: {
            boardId: Sequelize.where(
              Sequelize.literal('MD5(boardId)'),
              req.boardId
            ),
          },
          attributes: ['id', 'name', 'description', 'active', 'lastModified'],
          include: [
            {
              model: boardSchema,
              attributes: [[Sequelize.literal('MD5(projectId)'), 'projectId']],
              include: [
                {
                  model: projectSchema,
                  where: {
                    [Op.or]: [{ project_admin: req.project_admin }],
                  },
                },
              ],
            },
            {
              model: userSchema,
              as: 'user',
              attributes: ['id', 'username'],
            },
            {
              model: userSchema,
              as: 'lastModifiedBy',
              attributes: ['id', 'username'],
            },
          ],
        })
        .then((result) => {
          if (result) {
            result = result.filter(
              (item) => item.dataValues.board.projectId === req.projectId
            );

            res.send(result);
          } else {
            res.send(null);
          }
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  markAsDone: async (req, res) => {
    try {
      await activitySchema
        .update(
          { active: req.active, lastModified: req.lastModified },
          {
            where: { id: req.id },
          }
        )
        .then(async (result) => res.send(result))
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  isAuthorizedToDelete: async (req, res) => {
    try {
      await activitySchema
        .findAll({
          where: {
            [Op.and]: [
              { id: req.id },
              {
                [Op.or]: [
                  { userId: req.userId },
                  { '$board.userId$': req.userId },
                ],
              },
            ],
          },
          include: [
            {
              model: boardSchema,
              required: true,
              attributes: [],
            },
          ],
        })
        .then(async (result) => {
          if (result.length !== 0) {
            res.send({ status: 'yes' });
          } else {
            res.send({ status: 'You are not authorized to delete' });
          }
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  deleteActivity: async (req, res) => {
    try {
      await activitySchema
        .destroy({
          where: { id: req.id },
        })
        .then((result) => {
          res.send({ status: result });
        })
        .catch((err) => res.send(err));
    } catch (error) {
      console.log('error');
      res.send(error);
    }
  },

  editActivity: async (req, res) => {
    try {
      await activitySchema
        .update(req, { where: { id: req.id } })
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

module.exports = activityModel;
