const config = require('../config.json'),
      deasync = require('deasync'),
      SequelizeAuto = require('sequelize-auto'),
      Sequelize = require('sequelize'),
      auto = new SequelizeAuto(config.database,config.user,config.password, {
        port: config.databasePort,
        additional:{
          timestamps: false
        }
      });

//const Op = Sequelize.Op;

var runSync = function() {
  var done = false;
  auto.run(()=>{done = true;});
  deasync.loopWhile(function(){return !done;});
}();

var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.databaseHost,
  dialect: 'mysql',
  port: config.databasePort,
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

Gebruikers.hasMany(Berichten,{foreignKey: 'AuteursID'});
Berichten.belongsTo(Gebruikers,{foreignKey: 'AuteursID'});
Gebruikers.belongsToMany(Groepen, {through: GroepsLeden, foreignKey: 'GebruikersID'});
Groepen.belongsToMany(Gebruikers, {through: GroepsLeden, foreignKey: 'GroepsID'});
Groepen.hasMany(Berichten,{foreignKey: 'GroepsID',as: 'berichten'});
Berichten.belongsTo(Groepen,{foreignKey: 'GroepsID'});

function getGroupList( user, cb ){

  var i,j, output = [];

  Groepen.findAll({
    attributes: ['ID','Naam'],
    include: [
      {
        model: Gebruikers,
        attributes: [],
        where: { ID: user }
      },
      {
        limit:1,
        model: Berichten,
        as: 'berichten',
        attributes: ['Tijd'],
        order: [[ 'Tijd', 'DESC' ]]
      }
    ]
  })
    .then( groups => {
      for(i=0;i<groups.length;i++) output[i] = groups[i];

      Groepen.findAll({
        where: {EigenaarsID: user},
        attributes: ["ID","Naam"],

        include: [
          {
            limit: 1,
            model: Berichten,
            as: 'berichten',
            attributes: ['Tijd'],
            order: [[ 'Tijd', 'DESC' ]]
          }
        ]
      })
        .then( groups => {
          for(j=0;j<groups.length;j++) output[i+j] = groups[j];
          output.sort((a,b)=>{
            if(a.berichten[0]&&b.berichten[0]&&a.berichten[0].dataValues.Tijd<b.berichten[0].dataValues.Tijd)return 1;
            else return -1;
          });
          cb(output);
        });
    });
}

// create a sequelize instance with our local mysql database information.
function findUser(user,pass,cb){
  Gebruikers.findOne({ where: { ID: user, Wachtwoord: pass}}).then(user=>{
    if(user)cb(true);
    else cb(false);
  });
}

function getGroupMessages(group,offset,cb){
  Berichten.findAll({
    where: {
      GroepsID: group
    }
  }).
    then(berichten=>{
      cb(berichten)
    })
}

function saveMessage(text,group,user,cb){
  if(GroepsLeden.findOne({ where: { GroepsID: group, GebruikersID: user}})||Groepen.findOne({ where: { ID: group, EigenaarsID: user}}))
    Berichten.create({
      Bericht: text,
      AuteursID: user,
      GroepsID: group
    }).then(()=>{cb(false)});
}

function getGroup(group,cb){
  console.log(group)
  Groepen.findOne({ where: { ID: group }}).then((group)=>{console.log(group)});
}

exports.sequelize = sequelize;
exports.findUser = findUser;
exports.getGroupList = getGroupList;
exports.getGroupMessages = getGroupMessages;
exports.saveMessage = saveMessage;
exports.getGroup = getGroup;
