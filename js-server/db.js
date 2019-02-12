const mysql = require('mysql');

var exports = module.exports = {};
var config = require('../config.json');

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
