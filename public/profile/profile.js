'use strict';

var profile = angular.module('crowdmath.profile', []);

profile.controller('ProfileCtrl', ['$scope', '$routeParams', '$location', 'User', 'Book',
  function($scope, $routeParams, $location, User, Book) {
    if($routeParams.username) {
      $scope.user = User.get({username: $routeParams.username});
    } else {
      $scope.user = User.get();
    }
    
    $scope.createBook = function() {
      var newBook = new Book();
      newBook.title = "New book";
      newBook.$save(function(book) {
        $location.path("profile/" + $scope.user.username + "/book/" + book.title);
      });
    }
  }
]);