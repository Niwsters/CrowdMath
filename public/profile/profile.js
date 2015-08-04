'use strict';

var profile = angular.module('crowdmath.profile', []);

profile.controller('ProfileCtrl', ['$scope', '$state', '$stateParams', '$location', 'User', 'Book', 'Books',
  function ($scope, $state, $stateParams, $location, User, Book, Books) {
    var getProfileBooks = function (userID) {
      $scope.books = Books.query({
        authorID: userID
      });
    };

    if ($stateParams.username) {
      $scope.user = User.get({
        username: $stateParams.username
      }, function(res) {
        if(res._id) {
          getProfileBooks(res._id);
        } else {
          $state.transitionTo('404notfound');
        }
      });
    } else {
      $scope.user = User.get({}, function(res) {
        if(res._id) {
          getProfileBooks(res._id);
        } else {
          $state.transitionTo('404notfound');
        }
      });
    }
    
    $scope.newBook = new Book();
    $scope.saveNewBook = function () {
      $scope.newBook.$save(function (book) {
        $scope.books.push(book);
        $scope.newBook = new Book();
        $scope.createNewBookError = '';
      }, function(res) {
        $scope.createNewBookError = res.data;
      });
    };
  }
]);