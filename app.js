require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

//Routers
const index = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');


// require database configuration
require('./configs/db.config');

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(bindUserToViewLocals);


// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';





// use session here:                 V
require('./configs/session.config')(app);
//                                   ^                     |
// the "app" that gets passed here is the previously defined Express app (const app = express();)

// Routes middleware
app.use('/', index);
app.use('/', authRouter);


// app.use('/', index);
//      |  |  |
//      |  |  |
//      V  V  V
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'))
app.use('/', require('./routes/author.routes'));
app.use('/', require('./routes/book.routes'));




// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error');
});


module.exports = app;