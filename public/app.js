'use strict';

var app = angular.module('crowdmath', [
  'ui.router',
  'ngSanitize',
  'dndLists',
  'ngCookies',
  'crowdmath.profile',
  'crowdmath.bookCtrl',
  'crowdmath.bookModel',
  'crowdmath.userModel',
  'crowdmath.page',
  'crowdmath.pageModel',
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
      params: { bookID: { value: false } },
      templateUrl: 'book/book.html',
      controller: 'BookCtrl'
    })
    
    .state('books', {
      url: '/books',
      templateUrl: 'book/book-list.html',
      controller: 'BookListCtrl'
    })
    
    .state('page', {
      url: '/book/:bookTitle/page/:pageNumber',
      params: { pageID: { value: false }, bookID: { value: false } },
      templateUrl: '/page/page.html',
      controller: 'PageCtrl'
    })
    
    .state('pageByID', {
      url: 'page/:pageID',
      params: { bookTitle: { value: false }, bookID: { value: false } },
      templateUrl: '/page/page.html',
      controller: 'PageCtrl'
    })
    
    .state('404notfound', {
      url: '/404notfound',
      templateUrl: '/shared/404notfound.html'
    });
    
    $urlRouterProvider
    
    .when('/', '/profile/')
    
    .when('/profile', '/profile/');
  }
])

.controller('CrowdmathCtrl', ['$scope', 'User', function ($scope, User) {
  User.get({}, function (user) {
    $scope.isLoggedIn = user._id ? true : false;
  });
}]);
