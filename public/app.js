'use strict';

var app = angular.module('crowdmath', [
  'ngRoute',
  'crowdmath.profile',
  'crowdmath.book',
	'crowdmath.bookService',
	'crowdmath.userService'
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    
    when('/', {
      redirectTo: '/profile'
    }).
    when('/profile', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/profile/:username', {
      templateUrl: 'profile/profile.html',
      controller: 'ProfileCtrl'
    }).
    when('/profile/:username/book/:bookTitle', {
      templateUrl: 'book/book.html',
      controller: 'BookCtrl'
    });
  }
]);
