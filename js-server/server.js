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
      config = require('../config.json');

//create the session with random secret
//function {
  const db = require('./db')();
  //r();
//});

//dbPromise.then(()=>{
  const session = expressSession({
    key: 'user_sid',
    secret: 'ns&10Kd9;',
  /*  store: new (connectSessionSequelize(expressSession.Store))({
      db: db.sequelize
    }),
    */resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      //secure: true
      expires: 60 * 60 * 1000
    }
});//});

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
        req.session.username = username;
        //req.session.group = result[0].latestGroup;
        res.redirect('/');
      } else res.redirect('/login');
    });
  });

app.use(function (req, res, next) {
  res.status(404).sendFile('404.html',{root:'../html'})
});
