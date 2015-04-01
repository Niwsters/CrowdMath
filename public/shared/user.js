'use strict';

var user = angular.module('crowdmath.user', ['ngResource']);

user.factory('User', ['$resource', 
  function($resource) {
    return $resource('user', {}, {});
  }
]);

user.factory('Book', ['$resource',
  function($resource) {
    return $resource('user/book', {}, {});
  }
]);