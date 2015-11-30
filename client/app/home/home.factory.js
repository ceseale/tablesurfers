
(function() {
  'use strict';

  angular.module('app')
  .factory('homeFactory', homeFactory);

  homeFactory.$inject = ['$http'];

  function homeFactory($http) {
    var services = {
      
      getMeals : getMeals,
      getEvent : getEvent,
      joinMeal : joinMeal

    };

    return services;

    function getEvent () {
      return $http({
      method: 'GET',
      //hard coded in number(id as the meal id) for the minute need to work out how to get this id 
      //number to be kept with the infor displayed on the events page
      //so that when it is clicked on to show the whole event you know what event to query from the db
      //this also wants moking to the meal view
      url: '/api/meal/1'
      })
      .then(function (response) {
        return response.data;
      });
    }

    function getMeals () {
      return $http({
      method: 'GET',
      url: '/api/meal'
      })
      .then(function (response) {
        return response.data;
      });
    }

    function joinMeal (data) {
      return $http({
        method: 'PUT',
        url: '/api/meal',
        data: data
      })
      .then(function () {
        console.log("Join meal successfully!");
      })
      .catch(function (err) {
        console.log("ERR JOIN MEAL", err);
      });
    }

  }

})();

