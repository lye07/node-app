const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

// process.env.PORT (environment configuration will be passed by heroku at run time, process.env means to get underline environment and tell us which port to use)
//console.log(process.env)

const PORT = process.env.PORT || 5000;

app.listen(PORT);

// testing
