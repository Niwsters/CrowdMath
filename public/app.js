'use strict';

var app = angular.module('crowdmath', [
  'ui.router',
  'ngSanitize',
  'dndLists',
  'crowdmath.profile',
  'crowdmath.book',
  'crowdmath.bookService',
  'crowdmath.page',
  'crowdmath.userService',
  'crowdmath.mathjax',
  'crowdmath.directives',
  'crowdmath.filters'
]);

app.config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    
    .state('profile', {
      url: '/profile/:username',
      templateUrl: 'profile/profile.html',
      controller: 'ProfileCtrl'
    })
    
    .state('book', {
      url: '/book/:bookTitle',
      templateUrl: 'book/book-view.html',
      controller: 'BookViewCtrl'
    })
    
    .state('books', {
      url: '/books',
      templateUrl: 'book/book-list.html',
      controller: 'BookListCtrl'
    })
    
    .state('page', {
      url: '/book/:bookTitle/page/:pageNumber',
      templateUrl: '/page/page.html',
      controller: 'PageViewCtrl'
    })
    
    .state('404notfound', {
      url: '/404notfound',
      templateUrl: '/shared/404notfound.html'
    });
    
    $urlRouterProvider
    
    .when('/', '/profile/')
    
    .when('/profile', '/profile/');
  }
]);
