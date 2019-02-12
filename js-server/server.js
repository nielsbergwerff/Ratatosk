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
  keys: ['rttsk'],
  maxAge: 60 * 60 * 1000
});

const port = 80;

app.use('/js',express.static('../js-client'));
app.use('/css',express.static('../css'));
app.use('/images',express.static('../images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(session);

http.listen(port,()=>{
  console.log(`listening on *:${port}`);
});

io.on('connection',(socket)=>{

  //custom req and res for session
  var cookieString = socket.request.headers.cookie;
  var req = {connection: {encrypted: false}, headers: {cookie: cookieString}};
  var res = {getHeader: () =>{}, setHeader: () => {}};

  socket.on('set group',()=>{
    session(req,res,()=>{
      io.emit('set group',req.session.group);
    });
  });

  socket.on('chat message',(msg)=>{
    session(req,res,()=>{
        io.emit('chat message',req.session.username+": "+msg); // Do something with req.session
    });
  });

  socket.on('add group',(data)=>{});
});

app.get('/',(req,res)=>{
  if(req.session.loggedIn==='true')res.sendFile('index.html',{root:'../html'});
  else res.redirect('/login');
});

app.get('/login',(req,res)=>{
  res.sendFile('login.html',{root:'../html'});
});

app.post('/login',(req,res)=>{
  var username=req.body.username;
  var password=req.body.password;
  var hash = crypto.createHash('sha256').update(password).digest('hex');

  var sql = "Select * from users where username='"+username+"' and password='"+hash+"'";

  db.query(sql,(result)=>{
    if(result){
      req.session.loggedIn = 'true';
      req.session.username = username;
      req.session.group = result[0].latestGroup;
      res.redirect('/');
    } else res.redirect('/login');
  });
});
