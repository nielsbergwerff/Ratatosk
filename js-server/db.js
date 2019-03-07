const mysql = require('mysql'),
      config = require('../config.json'),
      SequelizeAuto = require('sequelize-auto'),
      Sequelize = require('sequelize'),
      auto = new SequelizeAuto(config.database,config.user,config.password, {
        additional:{
          timestamps: false
        }
      });

auto.run(function (err) {
    if (err) throw err;
//all following code is wrapped within this function
//no indents for my sanity

var sequelize = new Sequelize(config.database, config.user, config.password, {
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

const User = sequelize.import('./models/users');

// create a sequelize instance with our local mysql database information.
function findUser(user,pass,cb){
  User.findOne({ where: { username: user, password: pass} }).then(user=>{
    if(user)cb(true);
    else cb(false);
  });
}

exports.findUser = findUser;

//end of auto.run
});
