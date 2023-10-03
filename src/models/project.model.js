const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const projectSchema = require('../schema/project.schema');
const projectTypeSchema = require('../schema/projectType.schema');
const userSchema = require('../schema/user.schema');

projectSchema.belongsTo(projectTypeSchema, {
  foreignKey: 'type',
});

projectSchema.belongsTo(userSchema, {
  foreignKey: 'userId',
});

const projectModel = {
  addproject: async (req, res) => {
    try {
      await projectSchema
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

  projectTypeDrop: async (req, res) => {
    try {
      await projectTypeSchema
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

  viewproject: async (req, res) => {
    try {
      await projectSchema
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
      await projectSchema
        .findOne({
          where: {
            id: Sequelize.where(
              Sequelize.literal(`MD5(projects.id)`),
              req.id
            ),
          },
          attributes: [
            [Sequelize.literal('MD5(projects.id)'), 'id'],
            'name',
            'description',
            'type',
            'userId',
            'members',
          ],
          include: [
            {
              model: projectTypeSchema,
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
      await projectSchema
        .findOne({
          where: {
            id: Sequelize.where(Sequelize.literal('MD5(id)'), req.projectId),
          },
          attributes: ['id'],
        })
        .then(async (project) => {
          req.projectId = project.dataValues.id;

          await projectSchema
            .update(
              { members: req.addedMembers + req.members.join(',') + ',' },
              {
                where: {
                  [Op.and]: [{ userId: req.userId }, { id: req.projectId }],
                },
              }
            )
            .then((result) => {
              res.send(result);
            });
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  removeMember: async (req, res) => {
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

          await projectSchema
            .update(
              { members: req.members.join(',') + ',' },
              {
                where: {
                  [Op.and]: [{ userId: req.userId }, { id: req.projectId }],
                },
              }
            )
            .then((result) => {
              res.send(result);
            });
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  editproject: async (req, res) => {
    try {
      await projectSchema
        .update(
          { name: req.name },
          {
            where: {
              id: Sequelize.where(
                Sequelize.literal(`MD5(projects.id)`),
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

module.exports = projectModel;
