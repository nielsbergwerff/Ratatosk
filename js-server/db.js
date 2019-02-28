const mysql = require('mysql');
const config = require('../config.json');
const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto(config.database,config.user,config.password);

auto.run(function (err) {
  if (err) throw err;
});

var exports = module.exports = {};

var con = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
});

con.connect((err)=>{
  if(err) throw "Server connection error";
  else console.log("Connected to database");
});

function query(sql,cb){
  con.query(sql,(err,result)=>{
    if(result[0])cb(result);
    else cb(null);
  });
}

module.exports.query = query;

const UserModel = require('./models/users');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

// create a sequelize instance with our local mysql database information.
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
