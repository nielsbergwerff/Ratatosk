const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const crypto = require('crypto');
const helmet = require('helmet');
const db = require('./db');

const session = require("cookie-session")({
  name:'session',
  keys: ['key1','key2'],
  maxAge: 60 * 60 * 1000
});

const port = 80;

app.use('/js',express.static('js'));
app.use('/css',express.static('css'));
app.use('/images',express.static('images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(session);

app.get('/',(req,res)=>{
  if(req.session.loggedIn==='true')res.sendFile(__dirname + '/index.html');
  else res.sendFile(__dirname + '/login.html');
});

io.on('connection',(socket)=>{

  var cookieString = socket.request.headers.cookie;

  var req = {connection: {encrypted: false}, headers: {cookie: cookieString}};
  var res = {getHeader: () =>{}, setHeader: () => {}};

  socket.on('chat message',(msg)=>{
    session(req,res,()=>{
        io.emit('chat message',req.session.username+": "+msg); // Do something with req.session
    });
  });

  socket.on('add group',(data)=>{});
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

  console.log(db.query(sql));

  if(db.query(sql)){

    req.session.loggedIn = 'true';
    req.session.username = username;
    res.redirect('/');

  } else console.log('log in error');
});
