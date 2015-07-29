'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookCtrl', ['$scope', '$state', '$stateParams', '$window', 'User', 'Book', 'Page',
  function ($scope, $state, $stateParams, $window, User, Book, Page) {
    var bookTitle;

    // If no book title is given, send the user to a 404 error page.
    if ($stateParams.bookTitle) {
      bookTitle = $window.decodeURIComponent($stateParams.bookTitle);
    } else {
      $state.transitionTo('404notfound');
    }

    // Retrieve book from database using the book title in the route
    Book.get({
      title: bookTitle
    }, function (book) {

      // If no book was retrieved, send the user to a 404 error page.
      if (book._id) {
        
        $scope.book = book;
        
        // Check if user is author of book
        User.get({}, function (user) {
          if(user._id) {
            $scope.isUserAuthor = book.authors.indexOf(user._id) > -1
          }
        });
      } else {
        $state.transitionTo('404notfound');
      }
    });

    // Create a createPage function for creating a page in the view
    $scope.createPage = function () {
      var page = new Page();
      page.bookTitle = $scope.book.title;
      page.$save({
        bookTitle: $scope.book.title
      }, function (page) {
        $scope.book.pages.push(page);
      });
    };

    // Create a deletePage function for deleting a page in the view
    $scope.deletePage = function (pageNumber) {
      Page.delete({
        bookTitle: $scope.book.title,
        pageNumber: pageNumber
      }, function (res) {
        $scope.book.pages.splice(pageNumber - 1, 1)
      });
    };
    
    $scope.deleteBook = function () {
      $scope.book.$delete({
        id: $scope.book._id
      }, function () {
        $state.transitionTo('profile');
      });
    };
  }
]);

book.controller('BookListCtrl', ['$scope', 'Book',
  function ($scope, Book) {
    $scope.books = [];

    // Retrieve all books from database.
    Book.query({}, function (res) {
      $scope.books = res;
    });
  }
]);
