const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require("body-parser");
const crypto = require('crypto');
const helmet = require('helmet');
const db = require('./db');

//create the session with random keys
const session = require("cookie-session")({
  keys: ['ns&10Kd9;','yLd82^^2k'],
  maxAge: 60 * 60 * 1000
});

const port = 80;

//
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

  io.emit('set group list',db.getGroupList(socket.request.session.user));

  socket.on('set group',(group)=>{
    session(req,res,()=>{
      req.session.group = group;

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
  /*if(req.session.loggedIn==='true')*/res.sendFile('index.html',{root:'../html'});
  //else res.redirect('/login');
  req.session.user = "root";
});

app.get('/login',(req,res)=>{
  res.sendFile('login.html',{root:'../html'});
});

app.post('/login',(req,res)=>{
  var user=req.body.username;
  var pass=req.body.password;
  var hash = crypto.createHash('sha256').update(pass).digest('hex');

  var query = "Select * from users where username='"+user+"' and password='"+hash+"'";

  db.query(query,(result)=>{
    if(result){
      req.session.loggedIn = 'true';
      req.session.user = user;
      req.session.group = result[0].latestGroup;
      res.redirect('/');
    } else res.redirect('/login');
  });
});
