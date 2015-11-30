var express = require('express');
var _ = require('lodash');
var request = require('request');
var oauthSignature = require('oauth-signature');
var n = require('nonce')();
var qs = require('querystring');
var Promise = require('bluebird');

var auth = require('../config/auth.js');
var db = require('../config/db.js');



module.exports = function(db, passport, isLoggedIn) {

  var router = express.Router();

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  router.get('/facebook', passport.authenticate('facebook'));

  // handle the callback after facebook has authenticated the user
  router.get('/facebook/callback',
      passport.authenticate('facebook', {
          successRedirect : '/profile',
          failureRedirect : '/'
  }));

  // route for logging out
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  router.get('/user', function(req, res) {
    if (!req.user) {
      res.redirect('/');
    }
    else {
      res.send(req.user);
    }
  });
  return router;

};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) { // this is the only route that is middleware, and therefore needs to use the next parameter. 
  // "next" will be the last function in a router.get/post etc request, and isLoggedIn will be added as a middle param
  // e.g. router.get('/accounts', isLoggedIn, function(req, res) {...});
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
}
