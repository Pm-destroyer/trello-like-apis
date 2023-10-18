const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const activitySchema = require('../schema/activity.schema');
const taskSchema = require('../schema/task.schema');
const userSchema = require('../schema/user.schema');
const prioritySchema = require('../schema/priority.schema');
const projectSchema = require('../schema/project.schema');

// taskSchema.belongsTo(activitySchema, {
//   foreignKey: 'activityId',
// });

taskSchema.belongsTo(userSchema, {
  foreignKey: 'userId',
});

taskSchema.belongsTo(prioritySchema, {
  foreignKey: 'priorityId',
});

const activityModel = {
  addTask: async (req, res) => {
    try {
      const project_id = await projectSchema.findOne({
        where: {
          id: Sequelize.where(Sequelize.literal(`MD5(id)`), req.project_id),
        },
        attributes: ['id'],
      });

      await taskSchema
        .create({ ...req, ...{ project_id: project_id.id } })
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

  viewTaskById: async (req, res) => {
    try {
      let condition = {};
      if (typeof req.search !== 'undefined' && req.search.value != '') {
        condition.name = req.search.value;
      } else {
        condition.name = '';
      }
      let response = {};

      const countAll = await taskSchema.findAndCountAll({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                {
                  name: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('tasks.name')),
                    'LIKE',
                    '%' + condition.name.toLowerCase() + '%'
                  ),
                },
                {
                  estimated_hours: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('priority.name')),
                    'LIKE',
                    '%' + condition.name.toLowerCase() + '%'
                  ),
                },
                {
                  estimated_hours: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('estimated_hours')),
                    'LIKE',
                    '%' + condition.name.toLowerCase() + '%'
                  ),
                },
                {
                  actual_hours: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('actual_hours')),
                    'LIKE',
                    '%' + condition.name.toLowerCase() + '%'
                  ),
                },
                {
                  status: Sequelize.where(
                    Sequelize.fn('LOWER', Sequelize.col('status')),
                    'LIKE',
                    '%' + condition.name.toLowerCase() + '%'
                  ),
                },
              ],
            },
            {
              project_id: Sequelize.where(
                Sequelize.literal(`MD5(project_id)`),
                req.project_id
              ),
            },
          ],
        },
        include: [{ model: prioritySchema }],
      });

      const columns = req.columns.map((item) => item.data);

      await taskSchema
        .findAll({
          where: {
            [Op.and]: [
              {
                [Op.or]: [
                  {
                    name: Sequelize.where(
                      Sequelize.fn('LOWER', Sequelize.col('tasks.name')),
                      'LIKE',
                      '%' + condition.name.toLowerCase() + '%'
                    ),
                  },
                  {
                    estimated_hours: Sequelize.where(
                      Sequelize.fn('LOWER', Sequelize.col('priority.name')),
                      'LIKE',
                      '%' + condition.name.toLowerCase() + '%'
                    ),
                  },
                  {
                    estimated_hours: Sequelize.where(
                      Sequelize.fn('LOWER', Sequelize.col('estimated_hours')),
                      'LIKE',
                      '%' + condition.name.toLowerCase() + '%'
                    ),
                  },
                  {
                    actual_hours: Sequelize.where(
                      Sequelize.fn('LOWER', Sequelize.col('actual_hours')),
                      'LIKE',
                      '%' + condition.name.toLowerCase() + '%'
                    ),
                  },
                  {
                    status: Sequelize.where(
                      Sequelize.fn('LOWER', Sequelize.col('status')),
                      'LIKE',
                      '%' + condition.name.toLowerCase() + '%'
                    ),
                  },
                ],
              },
              {
                project_id: Sequelize.where(
                  Sequelize.literal(`MD5(project_id)`),
                  req.project_id
                ),
              },
            ],
          },
          include: [
            {
              model: prioritySchema,
              attributes: ['name'],
            },
          ],
          order: [
            [Sequelize.col(columns[req.order[0].column]), req.order[0].dir],
          ],
          raw: true,
          nest: true,
          limit: parseInt(req.length),
          offset: parseInt(req.start),
        })
        .then((result) => {
          if (result) {
            response = {
              status: '200',
              recordsTotal: countAll.count,
              recordsFiltered: countAll.count,
              data: result,
            };
            res.send(response);
          } else {
            response = {
              status: '404',
              data: 'task not found',
            };
            res.send(response);
          }
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  },

  viewTaskByLimit: async (req, res) => {
    await taskSchema
      .findAll({
        where: {
          project_id: Sequelize.where(
            Sequelize.literal(`MD5(project_id)`),
            req.project_id
          ),
        },
        limit: req.limit,
        include: [
          {
            model: prioritySchema,
            attributes: ['name'],
          },
        ],
      })
      .then(async (result) => {
        res.send(result);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },

  deleteTask: async (req, res) => {
    try {
      await taskSchema
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

  editTask: async (req, res) => {
    try {
      await taskSchema
        .update(req, { where: { id: req.id } })
        .then(async (result) => {
          if (result) {
            await activitySchema
              .update(
                { lastModified: req.userId },
                { where: { id: req.activityId } }
              )
              .then((activityRes) => res.send(activityRes))
              .catch((activityErr) => res.send(activityErr));
          } else res.send(null);
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

  markAsDone: async (req, res) => {
    try {
      await taskSchema
        .update(
          { status: req.status },
          {
            where: { id: req.id },
          }
        )
        .then(async (result) => {
          if (result) {
            await activitySchema
              .update(
                { lastModified: req.userId },
                { where: { id: req.activityId } }
              )
              .then((activityRes) => res.send(activityRes))
              .catch((activityErr) => res.send(activityErr));
          } else {
            res.send(null);
          }
        })
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  manageVisibility: async (req, res) => {
    try {
      await taskSchema
        .update(
          {
            visibleTo:
              req.visibleTo.length === 0 ? null : req.visibleTo.join(','),
          },
          {
            where: { id: req.id },
          }
        )
        .then(async (result) => {
          res.send(result);
        })
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  addedMembers: async (req, res) => {
    try {
      await taskSchema
        .findOne({
          where: { id: req.id },
          attributes: ['id', 'visibleTo'],
        })
        .then(async (result) => {
          if (result.dataValues.visibleTo !== null) {
            await userSchema
              .findAll({
                where: {
                  id: { [Op.in]: [result.dataValues.visibleTo.split(',')] },
                },
                attributes: ['id', 'username'],
              })
              .then((members) => {
                result.dataValues.members = members;
                res.send(result);
              });
          } else {
            res.send(result);
          }
        })
        .catch((err) => res.send(err));
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },

  addTaskPriority: async (req, res) => {
    await taskSchema
      .update(
        {
          priorityId: req.priorityId,
        },
        {
          where: { id: req.id },
        }
      )
      .then(async (result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  },

  priorityList: async (req, res) => {
    try {
      prioritySchema
        .findAll({
          attributes: ['id', 'name'],
        })
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  },
};

module.exports = activityModel;
