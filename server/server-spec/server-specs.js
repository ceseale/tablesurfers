var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var db = require('../config/db');
var Sequelize = require("sequelize");
var connectionString = process.env.DATABASE_URL || 'postgres://admin:admin@localhost:5432/tablesurfer';
var sequelize = new Sequelize(connectionString);

describe("User insertion to database", function() {

  // Tests are self contained, so though we need resolveWithFullResponse to test here, we do not need to replicate it in actual server/db
  var obj = {
      name: "Roger Fung",
      facebookId: 752345235364236
  };


  before(function () {
    return db.reset();
  });

  it("Should post new user to user database", function() { //no argument needed here bluebird thing when using mocha
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: obj, json: true})
    .then(function () {
      return db.User.findById(1);
    }).then(function (user) {
      expect(user.name).to.equal("Roger Fung");
    }).catch(function (err) {
      console.error(err);
    });
  });
  
  it("Should retrieve new user to user database", function() {
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
      expect(res[0].facebookId).to.equal('752345235364236');
    }).catch(function (err) {
        console.error(err);
    });
  });
    
  it("Should return a 400 error status for posting incorrect data", function () {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: {title: ""}, json: true})
    .catch(function (err) {
      expect(err.statusCode).to.equal(400);
    });
    
  });

  it("Should return a 201 when data is successfully added to database", function () {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: obj, json: true, resolveWithFullResponse: true})
    // this allows us to access response.statusCode in tests below. Other props can be found on response.body
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
    }).catch(function (err) {
      console.error(err);
    });
    
  });
});
describe("Meals insertion to database", function() {

  var obj = {
    name: "Super Duper",
    address: ["Hot Cakes Lane USA"],
    contact: "555-555-5555",
    lat: -76.0,
    lng: 76.0,
    cuisine: "Ethiopian",
    username: "Colin",
    title: "Beet Salad",
    date: "12/11/3015",
    time: "10:10pm",
    description: "Ethiopian beet salad is a tangy and delicious combination of marinated beets, spice, and sometimes potatoes and carrots."
  };
  var user = {
      name: "Colin",
      facebookId: 5243653562365
  };

  before(function () {
    return db.reset()
    .then(function () {
      return request({method: "POST", uri: "http://127.0.0.1:3000/api/user", body: user, json: true});
    });
  });

  it("Should have return an error (400) status for sending wrong data", function () { 
  
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: {title: ""}, json: true})
    .catch(function (err) {
      expect(err.statusCode).to.equal(400);
    });
    
  });

  it("Should have return an 201 when data gets successfully added to database", function () { 
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
    }).catch(function(err){
      console.error(err);
    });
    
  });


  it("Should persist data to database", function () { 
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
    }).catch(function (err) {
      console.error(err);
    });  
  });


  it("Should select data by id", function () { 
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true})
    .then(function () {
      return request({method: "GET", uri: "http://127.0.0.1:3000/api/meal/1", json: true});
    }).then(function (res) {
      expect(res.title).to.equal('Beet Salad');
    }).catch(function (err) {
      console.error(err);
    }); 
  });

  it("Should get all the meals in the database", function () { 
    var allPosts = [];
    for (var i = 0; i < 10; i ++) {
      allPosts.push(request({method:"POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true}));
    }

    return Promise.all(allPosts)
    .then(function () {
      return db.Meal.findAll();
    }).then(function (resp) {
      expect(resp.length).to.equal(13);
    })
    .catch(function (err) {
      console.error(err);
    });
    
  });

  it("Should add a user to a meal", function () { 
    var putObj = { name : "Colin" , facebookId : 5243653562365, description : obj.description };

    return request({method:"PUT", uri: "http://127.0.0.1:3000/api/meal", body: putObj, json: true, resolveWithFullResponse: true})
    .then(function (data) {
      return db.Meal.find( { where : { description : obj.description } } );
    }).then(function (meal) {
      return meal.getUsers();
    }).then(function (users) {
      expect(users[0].dataValues.name).to.equal('Colin');
    }).catch(function (err) {
      console.error(err);
    });
  });

});

