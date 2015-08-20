'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookCtrl', ['$scope', '$state', '$stateParams', '$window', 'User', 'Book', 'Page',
  function ($scope, $state, $stateParams, $window, User, Book, Page) {
    var bookTitle,
        bookID,
        bookQuery;
    
    // If no book title given, send to 404 error page.
    if (!$stateParams.bookTitle) $state.transitionTo('404notfound');
    
    // Retrieve and decode params
    bookTitle = $window.decodeURIComponent($stateParams.bookTitle);
    bookID = $stateParams.bookID;
    
    // If no book ID given, use book title in the query instead.
    if (bookID) {
      bookQuery = { id: bookID };
    } else {
      bookQuery = { title: bookTitle };
    }

    // Retrieve book from database using the book title in the route
    Book.get(bookQuery, function (book) {

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
    
    $scope.createPage = function () {
      var page = new Page();
      page.bookID = $scope.book.id;
      page.$save(function (page) {
        $scope.book.pages.push(page);
      });
    };
    
    $scope.deletePage = function (pageNumber) {
      Page.delete({
        pageID: $scope.book.pages[pageNumber - 1].id
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

book.controller('BookListCtrl', ['$scope', 'Books',
  function ($scope, Books) {
    $scope.books = [];

    // Retrieve all books from database.
    Books.query({}, function (res) {
      $scope.books = res;
    });
  }
]);
