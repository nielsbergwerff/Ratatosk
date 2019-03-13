const express = require('express'),
      app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      bodyParser = require("body-parser"),
      crypto = require('crypto'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      deasync = require('deasync'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session'),
      connectSessionSequelize = require('connect-session-sequelize'),
      db = require('./db'),
      config = require('../config.json');


const session = expressSession({
  key: 'user_sid',
  secret: 'ns&10Kd9;',
  store: new (connectSessionSequelize(expressSession.Store))({
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    //secure: true
    expires: 60 * 60 * 1000
  }
});

const port = 80;

//
app.use('/js',express.static('../js-client'));
app.use('/css',express.static('../css'));
app.use('/images',express.static('../images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session);

app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user)res.clearCookie('user_sid');
  next();
});

io.use(function(socket, next) {
    session(socket.request, socket.request.res, next);
});

http.listen(port,()=>{
  console.log(`listening on *:${port}`);
});

io.on('connection',(socket)=>{

  io.emit('set group list',db.getGroupList(socket.request.session.user));

  socket.on('set group',(group)=>{
    socket.request.session.group = group;
    io.emit('set group',socket.request.session.group);
  });

  socket.on('chat message',(msg)=>{
      io.emit('chat message',socket.request.session.user+": "+msg); // Do something with req.session
  });

  socket.on('add group',(data)=>{});
});

app.get('/',(req,res)=>{
  if(req.session.loggedIn==='true')res.sendFile('index.html',{root:'../html'});
  else res.redirect('/login');
});

app.route('/login')
  .get((req,res)=>{
    res.sendFile('login.html',{root:'../html'});
  })
  .post((req,res)=>{
    var username=req.body.username,
        password=req.body.password;
    var hash = crypto.createHash('sha256').update(password).digest('hex');

    db.findUser(username,hash,(result)=>{
      if(result){
        req.session.loggedIn = 'true';
        req.session.user = username;
        //req.session.group = result[0].latestGroup;
        res.redirect('/');
      } else res.redirect('/login');
    });
  });

app.use(function (req, res, next) {
  res.status(404).sendFile('404.html',{root:'../html'})
});
