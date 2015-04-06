'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookCtrl', ['$scope', '$routeParams', 'Book',
  function($scope, $routeParams, Book) {
    $scope.book = Book.get({username: $routeParams.username, bookTitle: $routeParams.bookTitle});
  }
]);
