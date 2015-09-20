'use strict';

var userModel = angular.module('crowdmath.userModel', ['ngResource']);

userModel.factory('User', ['$resource', function ($resource) {
  var User = $resource('user', {}, {});
  
  return User;
}]);


