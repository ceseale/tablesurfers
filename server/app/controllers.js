var database = require('../config/db');
var Promise = require('bluebird');

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
            obj.push(meal.meal.dataValues);
          });
          return obj;
        })
        .catch(function(err){
          console.error(err);
        });
    },

    getOne: function (data) {
      return database.Meal.find({ where: {id: data}})
          .then(function (meal) {
              return meal;
          });
        },

    post: function (data) {
      var userId;
      var restaurantId;

      console.log("POST MEAL DATA--->", data);

      return database.User.find({where: {facebookId: data.host.facebookId}})
      .then(function (user) {
        userId = user.id;
        return database.Restaurant.findOrCreate({
          where: {
            name: data.restaurant.name,
            address: data.restaurant.address
          },
          defaults: {
            name: data.restaurant.name,
            address: data.restaurant.address,
            contact: data.restaurant.contact,
            lat: data.restaurant.lat,
            lng: data.restaurant.lng,
            cuisine: data.restaurant.cuisine,
            image_url: data.restaurant.image_url,
            url: data.restaurant.url
          }
        });
      })
      .then(function (restaurant) {
        restaurantId = restaurant.id;
        return;
      })
      .then(function () {
        return database.Meal.create({
          title: data.meal.title,
          date: data.meal.date,
          time: data.meal.time,
          description: data.meal.description,
          theme: data.meal.theme,
          attendeeLimit: data.meal.attendeeLimit,
          RestaurantId: restaurantId,
          HostId: userId
        });
      })
      .catch(function (err) {
        console.error('POST MEAL ERROR', err);
      });
    }
  }
};
