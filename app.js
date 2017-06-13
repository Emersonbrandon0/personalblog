var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator=require("express-validator");
var cookieParser = require('cookie-parser');
var session=require("express-session");
var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var mongo=require("mongodb");
var db=require("monk")('localhost/nodeblog');
var mongoose=require('mongoose');
mongoose.connect('localhost/nodeblog');
var db2=mongoose.connection;
var multer=require("multer");
var flash=require("connect-flash");
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');

var index = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var admin = require('./routes/admin');

var app = express();

app.locals.moment=require('moment');
app.locals.truncateText = function(text,length){
  if(text.length<500){
    var truncatedText=text;
    return truncatedText;
  }
  var truncatedText=text.substring(0,length)+'...';
  return truncatedText;
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Handle file uploads
var upload = multer({ dest: 'public/images/uploads/' });

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Handle express sessions
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/admin', admin);

app.use(function(req,res,next){
	req.db=db;
	next();
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
