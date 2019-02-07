const mysql = require('mysql');

var exports = module.exports = {};
var config = require('./config.json');

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

function query(sql){
  con.query(sql,(err,result)=>{
    if(err)return err;
    else return result;
  });
}

module.exports.query = query;
