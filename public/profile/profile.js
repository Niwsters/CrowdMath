'use strict';

var profile = angular.module('crowdmath.profile', []);

profile.controller('ProfileCtrl', ['$scope', '$state', '$stateParams', '$location', 'User', 'Book',
  function ($scope, $state, $stateParams, $location, User, Book) {
    var getProfileBooks = function () {
      $scope.books = Book.query({
        authorID: $scope.user._id
      });
    };

    if ($stateParams.username) {
      $scope.user = User.get({
        username: $stateParams.username
      }, function(res) {
        if(res._id) {
          getProfileBooks();
        } else {
          $state.transitionTo('404notfound');
        }
      });
    } else {
      $scope.user = User.get({}, function(res) {
        if(res._id) {
          getProfileBooks();
        } else {
          $state.transitionTo('404notfound');
        }
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
  }
]);