const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const userSchema = require('../schema/user.schema');
const workspaceSchema = require('../schema/workspace.schema');

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
      await workspaceSchema
        .findOne({
          where: {
            id: Sequelize.where(
              Sequelize.literal(`MD5(workspaces.id)`),
              req.workspaceId
            ),
          },
          attributes: ['members'],
        })
        .then(async (resWorkspace) => {
          const members =
            resWorkspace.dataValues.members !== null
              ? resWorkspace.dataValues.members.split(',')
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
};

module.exports = UserModel;
