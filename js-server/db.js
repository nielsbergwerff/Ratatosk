const config = require('../config.json'),
      deasync = require('deasync'),
      SequelizeAuto = require('sequelize-auto'),
      Sequelize = require('sequelize'),
      auto = new SequelizeAuto(config.database,config.user,config.password, {
        port: config.databasePort,
        logging: false,
        additional:{
          timestamps: false
        }
      })

//const Op = Sequelize.Op

var runSync = function() {
  var done = false
  auto.run(()=>{done = true })
  deasync.loopWhile(function(){return !done })
}()

var sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.databaseHost,
  dialect: 'mysql',
  port: config.databasePort,
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
.catch(err => {
  console.error('Unable to connect to the database:', err)
})

const Gebruikers = sequelize.import('./models/gebruikers'),
      Berichten = sequelize.import('./models/berichten'),
      Groepen = sequelize.import('./models/groepen')
      GroepsLeden = sequelize.import('./models/groepsleden')

Gebruikers.hasMany(Berichten,{foreignKey: 'AuteursID'})
Berichten.belongsTo(Gebruikers,{foreignKey: 'AuteursID'})
Gebruikers.belongsToMany(Groepen, {through: GroepsLeden, foreignKey: 'GebruikersID'})
Groepen.belongsToMany(Gebruikers, {through: GroepsLeden, foreignKey: 'GroepsID'})
Groepen.hasMany(Berichten,{foreignKey: 'GroepsID',as: 'berichten'})
Berichten.belongsTo(Groepen,{foreignKey: 'GroepsID'})
Groepen.hasMany(GroepsLeden,{foreignKey: 'GroepsID'})
GroepsLeden.belongsTo(Groepen,{foreignKey: 'GroepsID'})
Gebruikers.hasMany(GroepsLeden,{foreignKey: 'GebruikersID'})
GroepsLeden.belongsTo(Gebruikers,{foreignKey: 'GebruikersID'})

function isAdmin(user,group,cb){
  Groepen.findOne({
    where: {
      ID: group,
      EigenaarsID: user
    }
  }).then(result=>{
    if(result)return cb(false)
  })
}

function getMemberGroups(user,cb){
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
    .then( groups => {cb(groups)})
}

function getOwnerGroups(user, cb){
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
    .then( groups => {cb(groups)})
}

function getGroupList( user, cb ){

  var i,j, output = []

  getMemberGroups(user,groups=>{
    for(i=0; i<groups.length; i++) output[i] = groups[i]

    getOwnerGroups(user,groups=>{
      for(j=0; j<groups.length; j++) output[i+j] = groups[j]
        output.sort((a,b)=>{
          if(a.berichten[0]&&b.berichten[0]&&a.berichten[0].dataValues.Tijd<b.berichten[0].dataValues.Tijd)return 1
          else if(b.berichten[0]) return 1
          return -1
        })
        cb(output)
      })
    })
}

function getMemberList(user,groupID,cb){

  var i,output = []

  getGroupList(user,list=>{
    for(var item of list)if(item.ID==groupID){
      Groepen.findOne({
        where: { ID: groupID }
      })
        .then(group=>{
          output[0] = group.dataValues.EigenaarsID

      GroepsLeden.findAll({ where: {GroepsID: groupID}})
        .then(groups=>{
          for(i=0; i<groups.length; i++)output[i+1]=groups[i].dataValues.GebruikersID
          cb(output)
        })})
    }
  })
}

// create a sequelize instance with our local mysql database information.
function findUser(user,pass,cb){
  Gebruikers.findOne({ where: { ID: user, Wachtwoord: pass}}).then(user=>{
    if(user)cb(true)
    else cb(false)
  })
}

function getGroupMessages(group,cb){

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
    }).then(()=>{cb(false)})
}

function getGroup(group,cb){
  Groepen.findOne({ where: { ID: group }}).then((group)=>{cb(group)})
}

function addGroup(user,name,cb){
  Groepen.create({
    Naam: name,
    EigenaarsID: user
  }).then(group=>{cb(group)})
}

function addGroupMember(owner,user,group,isAdmin,cb){
  getGroupList(owner,list=>{
    for(var item in list)if(item.ID=group){
      GroepsLeden.create({
        GebruikersID: user,
        GroepsID: group,
        isBeheerder: isAdmin
      }).then(result=>{
        if(result)cb(false)
      }).catch(err=>{
        console.log(err)
      })
    }
  })
}

function removeGroup(user,group,cb){
  Groepen.destroy({ where: { ID: group, EigenaarsID: user }})
    .then(result=>{
      if(result)cb(false)
    })
}

function removeMember(owner,group,member,cb){
  isAdmin(owner,group,err=>{
    if(!err){
      GroepsLeden.destroy({
        where: {
          GebruikersID: member,
          GroepsID: group
        }
      }).then(result=>{
        if(result)cb(false)
      })
    }
  })
}

exports.sequelize = sequelize
exports.findUser = findUser
exports.getGroupList = getGroupList
exports.getGroupMessages = getGroupMessages
exports.saveMessage = saveMessage
exports.getGroup = getGroup
exports.addGroup = addGroup
exports.addGroupMember = addGroupMember
exports.getMemberList = getMemberList
exports.removeGroup = removeGroup
exports.removeMember = removeMember
