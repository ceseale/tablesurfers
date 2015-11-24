// server.js

// set up ======================================================================
var express       = require('express');
var app           = express();
var port          = process.env.PORT || 3000;
var path          = require('path');
var morgan        = require('morgan');
var passport      = require('passport');
var flash         = require('connect-flash');
var bodyParser    = require('body-parser');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');
var userRoutes    = require('./routes/userRoutes');
var mealRoutes    = require('./routes/mealRoutes');
var mealsidRoutes = require('./routes/mealsIdRoutes');

// configuration ===============================================================

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.use(session({ secret: 'soroushisnumberone' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// require the routes file
var fbRouter = require('./routes/FBauth');
var yelpRouter = require('./routes/yelp');

var dbController = require('./app/controllers');
var isLoggedIn = require('./app/isLoggedIn');

userRoutes('/api/user', app, dbController);
mealsidRoutes('/api/meal/:id', app, dbController);
mealRoutes('/api/meal', app, dbController);

// require isLoggedIn method so we can use it in routes to check if user is logged in
fbRouter = fbRouter(dbController, passport, isLoggedIn);
yelpRouter = yelpRouter(dbController, passport, isLoggedIn);

app.use('/auth', fbRouter);
app.use('/api/yelp', yelpRouter);

app.get('/profile', function (req, res) {
  console.log(req);
  res.redirect('http://localhost:3000/#/user/'+req.user.facebookId);
});

app.use(express.static(path.join(__dirname, '/../client')));

app.listen(port);
console.log('Server now listening on port ' + port);
