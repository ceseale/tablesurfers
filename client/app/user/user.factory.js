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
        url: 'http://localhost:3000' + path,
        method: 'GET'
      })
      .then(function(response) {
        console.log(response);
        return response;
      });
    }
  }

})();
