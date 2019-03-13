const mysql = require('mysql'),
      config = require('../config.json'),
      deasync = require('deasync'),
      SequelizeAuto = require('sequelize-auto'),
      Sequelize = require('sequelize'),
      auto = new SequelizeAuto(config.database,config.user,config.password, {
        additional:{
          timestamps: false
        }
      });

var runSync = function() {
  var done = false;
  auto.run(()=>{done = true;});
  deasync.loopWhile(function(){return !done;});
}();

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

const Gebruikers = sequelize.import('./models/gebruikers');
const Berichten = sequelize.import('./models/berichten');
const Groepen = sequelize.import('./models/groepen');

function getGroupList(user){
  Gebruikers.findOne({where:{ID:user}}).then(user=>{
    console.log(user.dataValues.ID)
    return user.dataValues.ID;
  })
}

// create a sequelize instance with our local mysql database information.
function findUser(user,pass,cb){
  Gebruikers.findOne({ where: { ID  : user, Wachtwoord: pass} }).then(user=>{
    if(user)cb(true);
    else cb(false);
  });
}

exports.sequelize = sequelize;
exports.findUser = findUser;
exports.getGroupList = getGroupList;
