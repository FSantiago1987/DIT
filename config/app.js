let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');


// modules for authentication
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let passport = require('passport');
let passportLocal = require('passport-local');
let localStrategy = passportLocal.Strategy;
let flash = require('connect-flash');

//database setup
let mongoose = require('mongoose');
let DB = require('./db');

// Passport Config
require('./passport')(passport);

// point mongoose to the DB URI
mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Connected to MongoDB...');
});

let indexRouter = require('../routes/index');
let usersRouter = require('../routes/users');
let authRouter = require('../routes/auth');
let radialRouter = require('../routes/radial_menu');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));


// setup express session
app.use(session({
  secret: "someSecret",
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({ 
    mongooseConnection: mongoose.connection,
    ttl: 20 * 60, // expires in 20 min
    autoRemove: 'interval',
    autoRemoveInterval: 2 
  }),
}));

// initialize flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// passport user configuration

//create User Model Instance
let userModel = require('../models/user');
let User = userModel.User;

// implement a User Authentication Strategy
passport.use(User.createStrategy());

// serialize and deserialize the User Info
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/radial-list', radialRouter);
app.use('/auth', authRouter);

app.locals.truncate = (str, len) =>  {
  if(str.length > len && str.length > 0) {
    let new_str = str + '';
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(' '));
    new_str = new_str.length > 0 ? new_str: str.substr(0, len);
    return new_str + '...';
  }
  return str;
}

app.locals.truncate = (str, len) =>  {
  if(str.length > len && str.length > 0) {
    let new_str = str + '';
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(' '));
    new_str = new_str.length > 0 ? new_str: str.substr(0, len);
    return new_str + '...';
  }
  return str;
}

app.locals.capitalize = (str) =>  {
  if(typeof str !== 'string')
    return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

app.locals.Speak = (str) => {
  say.speak(str);
}

app.locals.stringifyNumber = (n) => {
  var special = ['zeroth','First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth', 'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth', 'Nineteenth'];
  var deca = ['Twent', 'Thirt', 'Fort', 'Fift', 'Sixt', 'Sevent', 'Eight', 'Ninet'];
  if (n < 20) 
    return special[n];
  if (n%10 === 0) 
    return deca[Math.floor(n/10)-2] + 'ieth';
  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
}

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
  res.render('error', {title: 'Error'});
});

module.exports = app;
