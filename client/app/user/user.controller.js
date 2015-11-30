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
      var windowUserName = sessionStorage.getItem('name');
      var windowProfilePic = sessionStorage.getItem('profilePic');
      var windowFacebookId = sessionStorage.getItem('facebookId');
      if (!windowUserName || !windowProfilePic || !windowFacebookId) {
        return self.getUser()
        .then(function (user) {
          sessionStorage.setItem('name', user.data.name);
          sessionStorage.setItem('profilePic', user.data.profilePic);
          sessionStorage.setItem('facebookId', user.data.facebookId);
          self.user = user.data;
        });
      }
      else {
        var windowUser = {
          name: windowUserName,
          profilePic: windowProfilePic,
          facebookId: windowFacebookId
        };
        self.user = windowUser;
      }
    };

    self.init();
  }

})();
