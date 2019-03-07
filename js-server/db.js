const mysql = require('mysql');
const config = require('../config.json');
const SequelizeAuto = require('sequelize-auto');
const Sequelize = require('sequelize');
const auto = new SequelizeAuto(config.database,config.user,config.password);

auto.run(function (err) {
  if (err) throw err;
  else {
    const sequelize = new Sequelize(config.database, config.user, config.password, {
      host: config.host,
      dialect: 'mysql',
      operatorsAliases: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  }
});

var exports = module.exports = {};

const User = require('./models/users');
const bcrypt = require('bcrypt');

// create a sequelize instance with our local mysql database information.
function login(user,passUser.findOne({ where: { username: username } }).then(function (user) {
            if (!user) {
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/dashboard');
            }
        });
