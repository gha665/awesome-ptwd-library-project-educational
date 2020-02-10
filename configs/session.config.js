//require session
const session = require('express-session');

//require MONGOSTORE
const MongoStore = require('connect-mongo')(session);

//require mongoose
const mongoose = require('mongoose');


module.exports = app => {
  app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 60000 },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 //<--- time to live: 1 day
      })
    })
  );
};