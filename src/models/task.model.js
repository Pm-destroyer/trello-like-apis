const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const activitySchema = require('../schema/activity.schema');
const taskSchema = require('../schema/task.schema');
const userSchema = require('../schema/user.schema');
const prioritySchema = require('../schema/priority.schema');

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
      await taskSchema
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
