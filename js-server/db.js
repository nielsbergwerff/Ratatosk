const config = require('../config.json'),
      deasync = require('deasync'),
      SequelizeAuto = require('sequelize-auto'),
      Sequelize = require('sequelize'),
      auto = new SequelizeAuto(config.database,config.user,config.password, {
        additional:{
          timestamps: false
        }
      });

const Op = Sequelize.Op;

var runSync = function() {
  var done = false;
  auto.run(()=>{done = true;});
  deasync.loopWhile(function(){return !done;});
}();

var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
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

const Gebruikers = sequelize.import('./models/gebruikers'),
      Berichten = sequelize.import('./models/berichten'),
      Groepen = sequelize.import('./models/groepen');
      GroepsLeden = sequelize.import('./models/groepsleden');

//Gebruikers.hasMany(Berichten);
//Berichten.belongsTo(Gebruikers);

//Gebruikers.hasMany(GroepsLeden);
//GroepsLeden.belongsTo(Gebruikers);

Groepen.hasMany(GroepsLeden);
GroepsLeden.belongsTo(Groepen);

//Groepen.hasMany(Berichten);
//Berichten.belongsTo(Groepen);

function getGroupList( user, cb ){

  var i, output = [];

  Groepen.findAll( {
    include:[
      {
        model: GroepsLeden
      }
    ]
  })
    .then( groups => {
      for(i=0;i<groups.length;i++) output[i] = [groups[i].dataValues.ID,groups[i].dataValues.Naam];
      cb(output);
    });
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
