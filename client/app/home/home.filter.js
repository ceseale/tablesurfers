(function() {
  'use strict';

  angular.module('app')
  .filter('date', function() {
    return function(input) {

      var date = input || '';
      var out = "";

      // iterate thru db?
      // check to see if getting appropriate data, else throw error
      // if (date === [anything in db]) {
      //   out = anything;
      // }

      return out;
    };
  });

})();
