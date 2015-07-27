'use strict';

var bookService = angular.module('crowdmath.bookService', ['ngResource']);

bookService.factory('Book', ['$resource', 'User', function ($resource, User) {
  var Book = $resource('book', {}, {
    'update': {
      method: 'PUT'
    }
  });
  
  Book.prototype.isUserAuthor = function(userID) {
    if (Book.prototype.authors.indexOf(userID) > -1) {
      return true;
    }

    return false;
  };
  
  return Book;
}]);

bookService.factory('Page', ['$resource',function ($resource) {
  return $resource('book/page', {}, {
    'update': {
      method: 'PUT'
    }
  });
}]);
