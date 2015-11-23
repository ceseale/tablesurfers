var database = require('../config/db');
var Promise = require('bluebird');
var objectify = require('./../classes/controllerClasses');

module.exports = {
  user: {

    testGet: function () {
      return database.User.findAll()
      .then(function (users) {
        // console.log("TESTGET TO DB SUCCESS/THEN: ", users);
        return users;
      }).catch(function(err){
        // console.error("TESTGET TO DB ERROR: ", err);
      });
    },

    post: function (data) {
      return database.User.create({
        name: data.name,
        facebookId: data.facebookId
      })
      .catch(function (err) {
        console.error("Error creating user: ", err);
      });
    },

    //for a user joining a meal
    joinMeal: function(data) {
      var userFound;
      return database.User.find({ where: {name: data.name, facebookId: data.facebookId} })
      .then(function(user) {
        userFound = user;
        return database.Meal.find({where: {description: data.description}})
        .then(function (meal) {
          // console.log(meal);
          meal.addUser(userFound);
        });
      });
    }
  },

  meals: {

    // TODO: Perhaps rename to getAll?
    get: function (data) {
      return database.Meal.findAll({ include: [database.User, database.Restaurant]})
        .then(function (meals) {
          //use the bluebird promise functions
          return Promise.map(meals, function(meal) {
            return meal.getUsers().then(function(result) {
              var mealObj = {meal: meal, attendees: result};
              return mealObj;
            });
          });
        }).then(function(meals) {
          //make an object to send back
          var obj = [];
          meals.map(function(meal, i) {
            obj.push(new objectify.restaurantData(meal));
          });
          // console.log('----------',meals);
          return obj;
        });
    },

    getOne: function (data) {
      return database.Meal.find({ where: {id: data}})
          .then(function (meal) {
              return meal;
          });
        },

    post: function (data) {

      return database.User.find({where: {name: data.username}})
        .then(function (user) {
          return database.Restaurant.findOrCreate({where: {name: data.restaurant}, defaults:  {name: data.name, address: data.address, contact: data.contact, lat: data.lat, lng: data.lng, cuisine: data.cuisine}})
            .then(function (restaurant) {
              return database.Meal.create({
                title: data.title,
                date: data.date,
                time: data.time,
                description: data.description,
                UserId: user.dataValues.id,
                RestaurantId: restaurant[0].dataValues.id
              }).then(function (message) {
                return message;
              });
            }).catch(function(err){
              console.log(err);
            })
        })
    }
  },
  restaurants: {},
  cuisine: {}
};
