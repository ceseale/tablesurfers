(function() {
  'use strict';

  angular.module('app')
  .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$http', '$state', '$location', '$window'];

  function LoginCtrl($http, $state, $location, $window) {
    var self = this;

  }

})();
