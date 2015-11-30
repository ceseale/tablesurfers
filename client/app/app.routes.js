(function() {
  // using 'use strict' will prevent variable declaration errors
  'use strict';

  angular.module('app')
  .config(config);

  // dependencies are injected here, when placed in array it protects against minification
  config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdThemingProvider'];

  function config($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.otherwise('home');

    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('search', {
        url: '/search',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl'
      })
      // TODO: perhaps use URL params '/:username' to grab account details
      .state('user', {
        url: '/user/:name',
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      })
      // When you're linked to a unique id in a meal, we render the page
      .state('meal', {
        url: '/meal/:id',
        templateUrl: 'app/meal/meal.html',
        controller: 'MealCtrl'
      });
      // remove above semicolon to add more routes

    $mdThemingProvider.definePalette('Spice', {"50":"#fffbf9","100":"#fcc8b0","200":"#f9a27a","300":"#f67236","400":"#f55d19","500":"#e54e0a","600":"#c84409","700":"#aa3a07","800":"#8d3006","900":"#702605","A100":"#fffbf9","A200":"#fcc8b0","A400":"#f55d19","A700":"#aa3a07"});
    $mdThemingProvider.definePalette('Dry Amber', {"50":"#fbf5f2","100":"#ebc9b6","200":"#dea88a","300":"#cf7e53","400":"#c86c3b","500":"#b25f32","600":"#9a522b","700":"#824525","800":"#6a391e","900":"#522c17","A100":"#fbf5f2","A200":"#ebc9b6","A400":"#c86c3b","A700":"#824525"});
    $mdThemingProvider.theme('Getting Hungry')
      .primaryPalette('Spice')
      .accentPalette('Dry Amber');
      
  }

})();

  
