const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mysql = require('mysql');
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const crypto = require('crypto');
var helmet = require('helmet');

const port = 80;

app.use('/js',express.static('js'));
app.use('/css',express.static('css'));
app.use('/images',express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cookieSession({
  name: 'session',
  keys: ['akdw3','eo2ve'],
  maxAge: 60 * 60 * 1000 // 1 uur
}))

var con = mysql.createConnection({
  host: "localhost",
  user: "informatica",
  password: "6ElafvkpIoXMjuQd",
  database: "informatica"
});

con.connect((err)=>{
  if(err) throw "Server connection error";
  else console.log("Connected to database");
});

app.get('/',(req,res)=>{
  if(req.session.loggedIn==='true')res.sendFile(__dirname + '/index.html');
  else res.sendFile(__dirname + '/login.html');
});

io.on('connection',(socket)=>{
  var cookieString = socket.request.headers.cookie;

  var req = {connection: {encrypted: false}, headers: {cookie: cookieString}};
  var res = {getHeader: () =>{}, setHeader: () => {}};

  socket.on('chat message',(msg)=>{
    io.emit('chat message',req.session.username+': '+msg);
  });
});

app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/login.html');
});

http.listen(port,()=>{
  console.log(`listening on *:${port}`);
});

app.post('/login',(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;
  var hash = crypto.createHash('sha256').update(password).digest('hex');

  var sql = "Select * from users where username='"+username+"' and password='"+hash+"'";

  con.query(sql,(err,result)=>{

    if(result[0]) {
      res.session.cookie('loggedIn','true',{
        maxAge: 0,
        secure: true,
        httpOnly: true
      });
    }

    res.redirect('/');

  });
});


/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  });
});*/
