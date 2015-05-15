'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookViewCtrl', ['$scope', '$routeParams', 'Book',
  function($scope, $routeParams, Book) {
    $scope.book = Book.get({title: $routeParams.bookTitle});
  }
]);

book.controller('BookEditCtrl', ['$scope', '$routeParams', 'Book',
  function($scope, $routeParams, Book) {
    $scope.book = Book.get({title: $routeParams.bookTitle});
    
    $scope.saveEdit = function() {
      Book.update(null, {id: $scope.book._id, newAttrs: $scope.book}, function(res) {
        $scope.saveEditError = '';
        $scope.saveEditSuccess = 'Successfully updated book!';
      }, function(res) {
        $scope.saveEditError = res.data;
        $scope.saveEditSuccess = '';
      })
    }
  }
]);