//Toelichting is gegeven op een basis niveau zodat mensen zonder kennis van Node-JS zich nog een beetje wegwijs kunnen maken
//Hieronder staan alle gebruikte modules(open-source) van dit bestand
const express = require('express'),
      app = require('express')(),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      bodyParser = require("body-parser"),
      helmet = require('helmet'),
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session'),
      connectSessionSequelize = require('connect-session-sequelize'),
      //Eigen module
      db = require('./db');

//Configuratie waardes worden geïmporteerd
const config = require('../config.json');

//De session-opties worden gespecificeerd
const session = expressSession({
  //session naam
  key: 'user_sid',
  //session versleutelings sleutel
  secret: 'ns&10Kd9;',
  //plek voor de session om data op te slaan
  store: new (connectSessionSequelize(expressSession.Store))({
    //database wordt mee verbonden in db.js
    db: db.sequelize
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    //aan te zetten bij distributie
    //secure: true,
    //tijd dat de cookie geldig is
    expires: 16 * 60 * 60 * 1000
  }
});

//echte folders worden toegewezen aan virtuele folders
app.use('/js',express.static('../js-client'));
app.use('/css',express.static('../css'));
app.use('/images',express.static('../images'));
//post data wordt op req.body gezet
app.use(bodyParser.urlencoded({ extended: false }));
//bescherming
app.use(helmet());
//logs
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session);

//andere eigen modules die nu pas gebruikt moeten worden
const routing = require('./routing')(app,db),
      myIo = require('./io')(io,db);

//zo cookie op moeten ruimen als de session verlopen is
//NIET GETEST
app.use((req, res, next)=>{
  if (req.cookies.user_sid && !req.session.user)res.clearCookie('user_sid');
  next();
});

//verbindt socket.io met sessie
io.use((socket, next)=>{
    session(socket.request, socket.request.res, next);
});

//de server zoekt naar requests van clients op de ingestelde port
http.listen(config.port,()=>{
  console.log(`listening on *:${config.port}`);
});

//stuurt 404.html bij een 404-error
app.use(function (req, res, next) {
  res.status(404).sendFile('404.html',{root:'../html'})
});
