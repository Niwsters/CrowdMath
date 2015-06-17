'use strict';

var app = angular.module('crowdmath', [
  'ngRoute',
  'ngSanitize',
  'crowdmath.profile',
  'crowdmath.book',
  'crowdmath.bookService',
  'crowdmath.userService',
  'crowdmath.mathjax',
  'crowdmath.directives'
]);

app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/profile'
      })
      .when('/profile', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/profile/:username', {
        templateUrl: 'profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/book', {
        templateUrl: 'book/book-list.html',
        controller: 'BookListCtrl'
      })
      .when('/book/:bookTitle', {
        templateUrl: 'book/book-view.html',
        controller: 'BookViewCtrl'
      })
      .when('/book/:bookTitle/edit', {
        templateUrl: 'book/book-edit.html',
        controller: 'BookEditCtrl'
      })
      .when('/book/:bookTitle/page/:pageNumber', {
        templateUrl: 'book/page-view.html',
        controller: 'PageViewCtrl'
      })
      .when('/book/:bookTitle/page/:pageNumber/edit', {
        templateUrl: 'book/page-edit.html',
        controller: 'PageEditCtrl'
      })
      .otherwise({
        redirectTo: '/profile'
      });
  }
]);