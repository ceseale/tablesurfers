var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var db = require('../config/db');
var Sequelize = require("sequelize");


describe("User insertion to database successful", function() {

  var obj = {
      name: "Roger Fung",
      facebookId: '1212'
    };

  beforeEach(function () {
    sequelize = new Sequelize("tablesurfer", "admin", "admin", {dialect: 'postgres'});
    console.log("BEFORE EACH IS RUNNING."); 
    sequelize.sync({force:true})
    .then(function(){
    }).catch(function(err){
      console.log('err', err);
    });
  });

  it("Should post new user to user database", function(done) { //no argument needed here bluebird thing when using mocha
      console.log("RUNNING FIRST TEST: POST USER");
      return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/user", body: obj, json: true})
      .then(function () {
        return db.User.findById(1);
      })
      .then(function (user) {
        console.log("Get User: ", user); 
        expect(user.name).to.equal("Roger Fung");
        done();
      }).catch(function (err) {
        console.error("POST ERR"); // put err back in
      });

  });
  
  it("Should retrieve new user to user database", function(done) { //no argument needed here bluebird thing when using mocha
    //remember to return the promise inside- if all corrct the test will pass if not then the test will fail and no catch needed
      console.log("RUNNING SECOND TEST: GET USER"); 
      var options = {
        uri: 'http://127.0.0.1:3000/api/in/user',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
      };
       
      return request(options)
        .then(function (resp) {
            console.log('GETTING RESPONSE: ', resp);
            expect(resp[0].name).to.equal("Roger Fung");
            expect(resp[0].facebookId).to.equal('1211112');
            done();
        })
        .catch(function (err) {
            console.log('GET ERR: ');
        });
  });
    
  it("Should return a 400 error status for posting incorrect data", function (done) {
    console.log("RUNNING THIRD TEST: SHOULD RETURN 400 FOR INCORRECT POST TO USER"); 
    
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/user", body: {title: ""}, json: true})
    .then(function (data) {

    }).catch(function(err){
      console.log("POST SHOULD RETURN 400 ERROR BUT DOESNT: "); 
      expect(err.statusCode).to.equal(400);
      done();
    });
    
  });

  it("Should return a 201 when data is successfully added to database", function (done) {
    console.log("RUNNING FOURTH TEST: SHOULD RETURN 201 FOR CORRECT POST TO USER"); 

    return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/user", body: obj, json: true})
    .then(function (data) {
      expect(err.statusCode).to.equal(201);
      done();
    }).catch(function(err){
      console.error("POST SHOULD RETURN 201, BUT RECEIVES ERROR");
    });
    
  });


});

  // it("Should insert new meal to database", function(done) {
  //   // request({method: "POST", uri: "http://127.0.0.1:4568/api/users", json: {name: "Anna"}});
  //   request({method: "POST", uri: "http://127.0.0.1:4568/api/meals", json: {date: new Date(), time: new Date(), attendees: 5, description: "new meal", user: "Anna"}}, function);

  //   //query the Meals database for where the desciption is "new meal" and check if the attendees is 5
  //   var query = function () {
  //     database.Meals.findOne({ description: "new meal" })
  //     .then(function (users) {
  //       //check what console.logging
  //       console.log('meals return object in test 2:', users);
  //       expect(users.attendees).to.equal(5);
  //     });
  //   };
    // }






