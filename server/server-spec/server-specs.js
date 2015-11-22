var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var db = require('../config/db');
var Sequelize = require("sequelize");


describe("User insertion to database", function() {

  // Tests are self contained, so though we need resolveWithFullResponse to test here, we do not need to replicate it in actual server/db
  var obj = {
      name: "Roger Fung",
      facebookId: 752345235364236
  };


  before(function (done) {
    sequelize = new Sequelize("tablesurfer", "admin", "admin", {dialect: 'postgres'});
    sequelize.sync({force:true})
    .then(function(){
      done();
    }).catch(function(err){
      done(err);
    });
  });

  it("Should post new user to user database", function(done) { //no argument needed here bluebird thing when using mocha
      return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: obj, json: true})
      .then(function () {
        return db.User.findById(1);
      })
      .then(function (user) {
        expect(user.name).to.equal("Roger Fung");
        done();
      }).catch(function (err) {
        done(err);
      });

  });
  
  it("Should retrieve new user to user database", function(done) {
    //remember to return the promise inside- if all corrct the test will pass if not then the test will fail and no catch needed
      var options = {
        uri: 'http://127.0.0.1:3000/api/user',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
      };
       
      return request(options)
        .then(function (res) {
            expect(res[0].name).to.equal("Roger Fung"); // first entry in DB
            expect(res[0].facebookId).to.equal(752345235364236);
            done();
        })
        .catch(function (err) {
            done(err);
        });
  });
    
  it("Should return a 400 error status for posting incorrect data", function (done) {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: {title: ""}, json: true})
    .catch(function(err){
      expect(err.statusCode).to.equal(400);
      done();
    });
    
  });

  it("Should return a 201 when data is successfully added to database", function (done) {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: obj, json: true, resolveWithFullResponse: true})
    // this allows us to access response.statusCode in tests below. Other props can be found on response.body
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
      done();
    }).catch(function(err){
      done(err);
    });
    
  });


});
