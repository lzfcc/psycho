var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongooose = require('mongoose');

var routes = require('./routes/index');
var info = require('./routes/info');
var instr = require('./routes/instruction');
var test = require('./routes/test');
var about = require('./routes/about');
var contact = require('./routes/contact');
var admin = require('./routes/admin');


var app = express();

//mongooose.connect('mongodb://localhost/psycho');
mongooose.connect('mongodb://lzf:abc123lzf@ds051534.mongolab.com:51534/psycho');
// view engine setup
app.set('views', path.join(__dirname, 'views'));

var handlebars = require('express-handlebars').create({defaultLayout: 'layout'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/info', info);
app.use('/instruction', instr);
app.use('/test', test);
app.use('/about', about);
app.use('/contact', contact);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
//启动：SET DEBUG=psycho:* & npm start
