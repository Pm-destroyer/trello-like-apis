const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const userSchema = require('../schema/user.schema');
const projectSchema = require('../schema/project.schema');

const checkDataExists = async (data) => {
  try {
    const result = await userSchema.findOne({
      where: { username: data.username },
    });
    return result !== null;
  } catch (error) {
    console.error(error);
  }
};

const UserModel = {
  addUser: async (req, res) => {
    try {
      const userExists = await checkDataExists(req);

      if (!userExists) {
        const token = jwt.sign(req, 'secretKey');
        req['token'] = token;

        await userSchema
          .create(req)
          .then((result) => {
            if (result) {
              res.send({ token: token });
            } else res.send(0);
          })
          .catch((error) => {
            console.log(error);
            res.send(error);
          });
      } else {
        res.send({ status: 'exist', message: 'Username already exists' });
      }
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  loginUser: async (req, res) => {
    try {
      const userExists = await checkDataExists(req);

      if (userExists) {
        await userSchema
          .findOne({
            where: { username: req.username },
            attributes: ['token', 'password'],
          })
          .then((result) => {
            if (
              req.password !== undefined &&
              result.dataValues.password === req.password
            ) {
              res.send({ status: 'exist', token: result.token });
            } else if (
              req.password !== undefined &&
              result.dataValues.password !== req.password
            ) {
              res.send({
                status: 'incorrect password',
                message: 'Please provide correct password',
              });
            } else {
              res.send({ token: result.token });
            }
          });
      } else if (!userExists && req.password === undefined) {
        const token = jwt.sign(req, 'secretKey');
        req['token'] = token;

        await userSchema
          .create(req)
          .then((result) => {
            if (result) {
              res.send({ token: token });
            } else res.send(0);
          })
          .catch((error) => {
            console.log(error);
            res.send(error);
          });
      } else {
        res.send({
          status: 'not exists',
          message: `You don't have an account, Please sign up`,
        });
      }
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  getUserByToken: async (req, res) => {
    try {
      await userSchema
        .findOne({
          where: req,
          attributes: ['id', 'username'],
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

  viewUsers: async (req, res) => {
    try {
      await projectSchema
        .findOne({
          where: {
            id: Sequelize.where(
              Sequelize.literal(`MD5(projects.id)`),
              req.projectId
            ),
          },
          attributes: ['members'],
        })
        .then(async (resproject) => {
          const members =
            resproject.dataValues.members !== null
              ? resproject.dataValues.members.split(',')
              : [];
          members.push(req.id);

          await userSchema
            .findAll({
              where: { id: { [Op.notIn]: members } },
              attributes: ['id', 'username'],
            })
            .then((result) => {
              res.send(result);
            });
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  userDropByproject: async (req, res) => {
    try {
      await projectSchema
        .findOne({
          where: {
            id: Sequelize.where(
              Sequelize.literal(`MD5(projects.id)`),
              req.projectId
            ),
          },
          attributes: ['members'],
        })
        .then(async (resproject) => {
          const members =
            resproject.dataValues.members !== null
              ? resproject.dataValues.members.split(',')
              : [];
          members.push(req.id);

          await userSchema
            .findAll({
              where: { id: { [Op.in]: members } },
              attributes: ['id', 'username'],
            })
            .then((result) => {
              res.send(result);
            });
        });
    } catch (err) {
      console.error(err);
      res.send(err);
    }
  },

  userListByLimit: async (req, res) => {
    await userSchema
      .findAll({
        attributes: ['id', 'username', 'first_name', 'last_name', 'roleId'],
        limit: req.limit,
      })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  },

  userList: async (req, res) => {
    let condition = {};
    if (typeof req.search !== 'undefined' && req.search.value != '') {
      condition.name = req.search.value;
    } else {
      condition.name = '';
    }

    const countAll = await userSchema.findAndCountAll({
      where: {
        [Op.or]: [
          {
            username: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('username')),
              'LIKE',
              '%' + condition.name.toLowerCase() + '%'
            ),
          },
          {
            first_name: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('first_name')),
              'LIKE',
              '%' + condition.name.toLowerCase() + '%'
            ),
          },
          {
            last_name: Sequelize.where(
              Sequelize.fn('LOWER', Sequelize.col('last_name')),
              'LIKE',
              '%' + condition.name.toLowerCase() + '%'
            ),
          },
        ],
      },
    });

    const columns = req.columns.map((item) => item.data);

    await userSchema
      .findAll({
        where: {
          [Op.or]: [
            {
              username: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('username')),
                'LIKE',
                '%' + condition.name.toLowerCase() + '%'
              ),
            },
            {
              first_name: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('first_name')),
                'LIKE',
                '%' + condition.name.toLowerCase() + '%'
              ),
            },
            {
              last_name: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('last_name')),
                'LIKE',
                '%' + condition.name.toLowerCase() + '%'
              ),
            },
          ],
        },
        attributes: ['id', 'username', 'first_name', 'last_name', 'roleId'],
        order: [
          [Sequelize.col(columns[req.order[0].column]), req.order[0].dir],
        ],
        raw: true,
        nest: true,
        limit: parseInt(req.length),
        offset: parseInt(req.start),
      })
      .then((result) => {
        const responseData = {
          recordsTotal: countAll.count,
          recordsFiltered: countAll.count,
          data: result,
        };

        res.send(responseData);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  },
};

module.exports = UserModel;
