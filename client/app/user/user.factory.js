(function () {
  'use strict';

  angular.module('app')
  .factory('userFactory', userFactory);

  // injecting in $http
  userFactory.$inject = ['$http', '$location'];
  // you must do the same below
  function userFactory($http, $location) {
    var services = {
      getUser: getUser
    };

    return services;

    function getUser() {
      var path = '/auth/user';
      return $http({
        url: path,
        method: 'GET'
      })
      .then(function(response) {
        return response;
      });
    }
  }

})();
