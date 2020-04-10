const cookieParser = require('cookie-parser'),
      createError = require('http-errors'),
      express = require('express'),
      helmet = require('helmet'),
      logger = require('morgan'),
      path = require('path'),

      router = require('./routing'),

      app = express()

// view engine setup
app.set('views', path.join(__dirname, '../public/views'))
app.set('view engine', 'pug')

// protection
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] }},
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: 'no-referrer' },
  featurePolicy: {
    features: {
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      camera: ["'none'"],
      documentDomain: ["'none'"],
      documentWrite: ["'none'"],
      encryptedMedia: ["'none'"],
      fontDisplayLateSwap: ["'none'"],
      fullscreen: ["'none'"],
      geolocation: ["'none'"],
      gyroscope: ["'none'"],
      layoutAnimations: ["'none'"],
      legacyImageFormats: ["'none'"],
      loadingFrameDefaultEager: ["'none'"],
      magnetometer: ["'none'"],
      microphone: ["'none'"],
      midi: ["'none'"],
      oversizedImages: ["'none'"],
      payment: ["'none'"],
      pictureInPicture: ["'none'"],
      serial: ["'none'"],
      speaker: ["'none'"],
      syncScript: ["'none'"],
      syncXhr: ["'none'"],
      unoptimizedImages: ["'none'"],
      unoptimizedLosslessImages: ["'none'"],
      unoptimizedLossyImages: ["'none'"],
      unsizedMedia: ["'none'"],
      usb: ["'none'"],
      verticalScroll: ["'none'"],
      vibrate: ["'none'"],
      vr: ["'none'"],
      wakeLock: ["'none'"],
      xr: ["'none'"]
    }
  }
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../public')))

app.use('/', router)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  next()
});

module.exports = app;
