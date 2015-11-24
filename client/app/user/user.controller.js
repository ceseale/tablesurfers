(function() {
  'use strict';

  angular.module('app')
  .controller('UserCtrl', UserCtrl);

  UserCtrl.$inject = ['$http', '$state', '$location', '$window', 'userFactory'];

  function UserCtrl($http, $state, $location, $window, userFactory) {
    var self = this;

    self.getUser = function() {
      return userFactory.getUser();
    };

    self.init = function() {
      return self.getUser()
      .then(function (user) {
        self.user = user.data;
      });
    };

    self.init();
  }

})();
