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



var dbController = require('./app/controllers');

// require the routes file
var inRouter = require('./app/routes/in');


var outRouter = require('./app/routes/out');

// require isLoggedIn method so we can use it in routes to check if user is logged in
var isLoggedIn = require('./app/isLoggedIn');

inRouter = inRouter(dbController, passport, isLoggedIn);
outRouter = outRouter(dbController, passport, isLoggedIn);

app.use('/api', inRouter);

app.get('/auth/facebook/callback', function (req, res) {
  res.redirect('/api'+req.url);
});

app.use('/auth', outRouter);

app.get('/profile', function (req, res) {
  res.redirect('http://localhost:3000/#/user/'+req.user.name);
});

app.use(express.static(path.join(__dirname, '/../client')));

app.listen(port);
console.log('Server now listening on port ' + port);
