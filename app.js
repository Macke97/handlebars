const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const secure = require('express-force-https');

// Using Environment variables
require('dotenv').config();

// DB connection
const { DB_USERNAME, DB_PASSWORD } = process.env;
const mongoose = require('mongoose');
mongoose.connect(
  `mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds137661.mlab.com:37661/hbs-test`,
  { useNewUrlParser: true },
  err => {
    err ? console.log(err) : console.log('DB connected!');
  }
);

// Import routes
const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

const app = express();

// Set server port
app.set('port', process.env.PORT || 3000);

// view engine setup
app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
      ifShowCookieInfo: function() {
        return app.locals.cookieInfo;
      }
    }
  })
);
app.set('view engine', '.hbs');

process.env.NODE_ENV === 'production' && app.use(secure);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Session and Passport
app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    keys: keys.session.keys
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  const cookie = req.cookies.cookieInfo;
  if (!cookie) {
    res.cookie('cookieInfo', true, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true
    });

    console.log('Created cookie');
  } else {
    console.log('Did not create cookie, user is not new');
  }
  next();
});

app.use((req, res, next) => {
  app.locals.user = req.user;
  next();
});

//app.use(logger('dev'));

// Routes, including API calls
app.use('/auth', authRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const certOptions = {
  key: fs.readFileSync(path.resolve('config/cert/server.key')),
  cert: fs.readFileSync(path.resolve('config/cert/server.crt'))
};

if (process.env.NODE_ENV !== 'development') {
  app.listen(app.get('port'), () => console.log(`Server is listening on port ${app.get('port')}`));
} else {
  https.createServer(certOptions, app).listen(3000);
  console.log('Server started HTTPS');
}
