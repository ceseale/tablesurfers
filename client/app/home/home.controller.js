(function() {
  'use strict';

  angular.module('app')
  .controller('HomeCtrl', HomeCtrl);

  // if factories are needed, inject here
  HomeCtrl.$inject = ['homeFactory', '$state', "$location", "$window"];

  function HomeCtrl(homeFactory, $state, $location, $window) {
    var self = this;

    self.getData = function() {
      //call the factory function to get all of the meals
      homeFactory.getMeals()
      .then(function(data) {
        console.log(data); 
        self.events = data;
      });
      
    };

    self.events = [];

    self.getData();



  }

})();
