'use strict';

var app = angular.module('crowdmath', [
  'ngRoute',
  'crowdmath.frontpage',
  'crowdmath.profile',
  'crowdmath.book',
  'crowdmath.user'
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