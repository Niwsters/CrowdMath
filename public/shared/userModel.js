'use strict';

var userModel = angular.module('crowdmath.userModel', ['ngResource']);

userModel.factory('User', ['$resource', function ($resource) {
  var User = $resource('user', {}, {});

  User.isAuthor = function (book, callback) {
    User.get({}, function (user) {
      var isAuthor = book.authors.indexOf(user._id) > -1;

      callback(isAuthor);
    });
  };
  
  return User;
}]);


