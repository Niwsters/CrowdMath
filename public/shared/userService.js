'use strict';

var userService = angular.module('crowdmath.userService', ['ngResource']);

userService.factory('User', ['$resource', 
  function($resource) {
    var User = $resource('user', {}, {});
    
    return User;
  }
]);