const express = require('express'),
      app = require('./app'),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      bodyParser = require("body-parser"),
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      expressSession = require('express-session'),
      connectSessionSequelize = require('connect-session-sequelize'),

      db = require('./db'),
      config = require('../config.json'),

      development = true,

      session = expressSession({
        // session name
        key: 'user_sid',
        // session hash salt
        secret: 'ns&10Kd9;',
        store: new (connectSessionSequelize(expressSession.Store))({
          // database to store session data
          db: db.sequelize
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          secure: !development,
          expires: 16 * 60 * 60 * 1000
        }
      })

// echte folders worden toegewezen aan virtuele folders
// bescherming
app.use(session)

// andere eigen modules die nu pas gebruikt moeten worden
const routing = require('./routing')(app,db),
      myIo = require('./io')(io,db)

// zo cookie op moeten ruimen als de session verlopen is
// NIET GETEST
app.use((req, res, next)=>{
  if (req.cookies.user_sid && !req.session.user) res.clearCookie('user_sid')
  next()
})

// verbindt socket.io met sessie
io.use((socket, next)=>{
    session(socket.request, socket.request.res, next)
});

// de server zoekt naar requests van clients op de ingestelde port
http.listen(config.port, ()=>{
  console.log(`listening on *:${config.port}`)
})

// stuurt 404.html bij een 404-error
app.use(function (req, res) {
  res.status(404).sendFile('404.html', {root:'../html'})
})
