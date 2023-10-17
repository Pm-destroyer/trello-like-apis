const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const projectSchema = require('../schema/project.schema');
const projectTypeSchema = require('../schema/projectType.schema');
const userSchema = require('../schema/user.schema');

projectSchema.belongsTo(projectTypeSchema, {
  foreignKey: 'type',
});

projectSchema.belongsTo(userSchema, {
  foreignKey: 'project_admin',
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
      console.log(req);
      await projectSchema
        .findAll({
          where: {
            [Op.or]: [{ project_admin: req.project_admin }],
          },
          attributes: [
            [Sequelize.literal('MD5(projects.id)'), 'id'],
            'name',
            'description',
            'project_admin',
            'status',
            'start_date',
            'end_date',
            'est_max_costs',
            'cost_type',
          ],
          include: [
            {
              model: projectTypeSchema,
              attributes: ['type', 'short_name'],
            },
          ],
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
            id: Sequelize.where(Sequelize.literal(`MD5(projects.id)`), req.id),
          },
          attributes: [
            [Sequelize.literal('MD5(projects.id)'), 'id'],
            'name',
            'description',
            'project_admin',
            'status',
            'start_date',
            'end_date',
            'est_max_costs',
            'cost_type',
          ],
          include: [
            {
              model: projectTypeSchema,
              attributes: ['type', 'short_name'],
            },
          ],
        })
        .then(async (result) => {
          if (result) {
            res.send(result);
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
