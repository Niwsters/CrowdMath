'use strict';

var userService = angular.module('crowdmath.userService', ['ngResource']);

// For accessing user data in the database
userService.factory('User', ['$resource', 
  function($resource) {
    var User = $resource('user', {}, {});
    return User;
  }
])