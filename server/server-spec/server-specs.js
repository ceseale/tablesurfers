var Promise = require('bluebird');
var request = require('request-promise');
var assert = require('assert');
var Mocha = require('mocha');
var expect = require('chai').expect;
var db = require('../config/db');

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
      console.error("NOT POSTING NEW USER TO DB");
      // console.error(err);
    });
  });
  
  it("Should retrieve new user from user database", function() {
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
      console.error("NOT RETREIVING NEW USER FROM DB");
      // console.error(err);
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
      console.error("NOT RETURNING 201 WHEN DATA POSTED SUCCESSFULLY");
      // console.error(err);
    });
    
  });
});

describe("Meals insertion to database", function() {

  var obj = {
    host: {
      facebookId: 5243653562365
    },
    meal: {
      title: "Men's Lunch",
      date: "12/7/15",
      time: "12:00pm",
      theme: "Hack Reactor Lunch for Men",
      attendeeLimit: 9,
      description: "Ethiopian beet salad is a tangy and delicious combination of marinated beets, spice, and sometimes potatoes and carrots."
    },
    restaurant: {
      name: "Super Duper",
      address: "1234 Powell St.",
      contact: "415-420-8282",
      lat: 123.45,
      lng: 125.89,
      cuisine: "American",
      image_url: "http://image.com/image.jpg",
      url: "http://yelp.com/kinkhao"
    }
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

  it("Should have return an error (400) status for sending incorrect meal data", function () {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: {title: ""}, json: true})
    .catch(function (err) {
      expect(err.statusCode).to.equal(400);
    });
  });

  it("Should have return an 201 when meal gets successfully added to database", function () {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
    .then(function (res) {
      expect(res.statusCode).to.equal(201);
    }).catch(function(err){
      console.error("NOT RETURNING 201 WHEN MEAL SUCCESSFULLY ADDED TO DB");
      // console.error(err);
    });
    
  });

  it("Should persist meal data to database", function () {
    return request({method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true, resolveWithFullResponse: true})
      .then(function (res) {
        return db.Restaurant.find({where: {cuisine: "American"}});
      }).then(function (restaurant) {
        expect(restaurant.cuisine).to.equal("American");
      }).catch(function (err) {
        console.error("DOES NOT PERSIST MEAL DATA TO DB");
        // console.error(err);
      });
  });

  it("Should select meal by id", function () {
    return request({
      method: "POST", uri: "http://127.0.0.1:3000/api/meal", body: obj, json: true
    }).then(function () {
      return request({
        method: "GET", uri: "http://127.0.0.1:3000/api/meal/1", json: true});
    }).then(function (res) {
      expect(res.title).to.equal("Men's Lunch");
    }).catch(function (err) {
      console.error("DOES NOT SELECT MEAL BY ID");
      // console.error(err);
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
    }).catch(function (err) {
      console.error("DOES NOT GET ALL MEALS IN DB");
      // console.error(err);
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
      console.error("NOT NOT ADD A USER TO A MEAL");
      // console.error(err);
    });
  });

});

