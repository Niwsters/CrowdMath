'use strict';

var bookService = angular.module('crowdmath.bookService', ['ngResource']);

bookService.factory('Book', ['$resource', 'User', function ($resource, User) {
  var Book = $resource('book', {}, {
    'update': {
      method: 'PUT'
    }
  });
  
  return Book;
}]);

bookService.factory('Books', ['$resource', function($resource) {
  return $resource('books', {});
}]);

bookService.factory('Page', ['$resource',function ($resource) {
  return $resource('book/page', {}, {
    'update': {
      method: 'PUT'
    }
  });
}]);
