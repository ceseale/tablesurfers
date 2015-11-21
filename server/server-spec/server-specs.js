var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var db = require('../config/db');
var Sequelize = require("sequelize");


describe("User insertion to database successful", function() {

  beforeEach(function (done) {
    sequelize = new Sequelize("tablesurfer", "admin", "admin", {dialect: 'postgres'});
    console.log("BEFORE EACH IS RUNNING."); 
    sequelize.sync({force:true})
    .then(function(){
    }).catch(function(err){
      console.log('err', err);
    });
    done();
  });

  it("Should post new user to user database", function(done) { //no argument needed here bluebird thing when using mocha
      console.log("RUNNING FIRST TEST: POST USER"); 
      return request({method: "POST", uri: "http://127.0.0.1:3000/api/in/user", body: {name: "Roger Fung", facebookId: '1212'}, json: true})
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
            console.log('GET ERR: ', err);
        });

      // console.log("SUCCESFUL. HERE'S THE DATA: ", data);
      //CHECK DATA OBJECTS PROPERTIES
      // need to GET to check this stuff
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






