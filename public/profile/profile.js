'use strict';

var profile = angular.module('crowdmath.profile', []);

profile.controller('ProfileCtrl', ['$scope', '$routeParams', '$location', 'User', 'Book',
  function ($scope, $routeParams, $location, User, Book) {
    var getProfileBooks = function () {
      $scope.books = Book.query({
        authorID: $scope.user._id
      });
    };

    if ($routeParams.username) {
      $scope.user = User.get({
        username: $routeParams.username
      }, function(user) {
        getProfileBooks();
      });
    } else {
      $scope.user = User.get({}, function(user) {
        getProfileBooks();
      });
    }

    $scope.createBook = function () {
      var newBook = new Book();
      newBook.title = $scope.newBookTitle;
      newBook.$save(function (book) {
        getProfileBooks();
        $scope.createNewBookError = '';
      }, function (res) {
        $scope.createNewBookError = res.data;
      });
    };

    $scope.deleteBook = function (book) {
      book.$delete({
        id: book._id
      }, function () {
        getProfileBooks();
        $scope.createNewBookError = '';
      });
    };
  }
]);