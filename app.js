const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');

// Using Environment variables
require('dotenv').config();

// DB connection
const { DB_USERNAME, DB_PASSWORD } = process.env;
const mongoose = require('mongoose');
  mongoose.connect(`mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds137661.mlab.com:37661/hbs-test`, {useNewUrlParser: true}, (err) => {
  err ? console.log(err) : console.log('DB connected!');
});

// Import routes
const authRouter = require('./routes/api/auth');
const indexRouter = require('./routes/index');

const app = express();

// Set server port 
app.set('port', process.env.PORT || 3000);

// view engine setup
app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs', layoutsDir: __dirname + '/views/layouts',partialsDir: __dirname + '/views/partials' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes, including API calls
app.use('/auth', authRouter);
app.use('/', indexRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => console.log(`Server is listening on port ${app.get('port')}`));