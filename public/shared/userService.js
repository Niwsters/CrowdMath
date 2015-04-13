'use strict';

var userService = angular.module('crowdmath.userService', ['ngResource']);

userService.factory('User', ['$resource', 
  function($resource) {
    return $resource('user', {}, {});
  }
]);
