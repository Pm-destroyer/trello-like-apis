const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const boardSchema = require('../schema/board.schema');
const projectSchema = require('../schema/project.schema');

boardSchema.belongsTo(projectSchema, {
  foreignKey: 'projectId',
});

const BoardModel = {
  addBoard: async (req, res) => {
    try {
      await projectSchema
        .findOne({
          where: {
            id: Sequelize.where(Sequelize.literal('MD5(id)'), req.projectId),
          },
          attributes: ['id'],
        })
        .then(async (project) => {
          req.projectId = project.dataValues.id;

          await boardSchema
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

  viewBoard: async (req, res) => {
    try {
      await boardSchema
        .findAll({
          where: {
            projectId: Sequelize.where(
              Sequelize.literal('MD5(projectId)'),
              req.projectId
            ),
          },
          attributes: [[Sequelize.literal('MD5(boards.id)'), 'id'], 'name'],
          includes: [
            {
              model: projectSchema,
              where: {
                [Op.or]: [
                  { userId: req.userId },
                  {
                    members: { [Op.like]: `%${req.userId}%` },
                  },
                ],
              },
            },
          ],
        })
        .then((result) => res.send(result));
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  viewById: async (req, res) => {
    try {
      await boardSchema
        .findOne({
          where: {
            [Op.and]: [
              {
                id: Sequelize.where(Sequelize.literal('MD5(id)'), req.id),
              },
              {
                projectId: Sequelize.where(
                  Sequelize.literal('MD5(projectId)'),
                  req.projectId
                ),
              },
            ],
          },
          attributes: [
            [Sequelize.literal('MD5(id)'), 'id'],
            'name',
            'description',
            Sequelize.literal('MD5(projectId)', 'projectId'),
            'userId',
            'members',
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
                  result.dataValues.users = users;
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

  editBoard: async (req, res) => {
    try {
      await boardSchema
        .update(
          { name: req.name },
          {
            where: {
              id: Sequelize.where(Sequelize.literal('MD5(id)'), req.id),
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

module.exports = BoardModel;
