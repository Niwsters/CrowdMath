'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookViewCtrl', ['$scope', '$routeParams', 'Book', 'Page',
  function ($scope, $routeParams, Book, Page) {
    $scope.book = Book.get({
      title: $routeParams.bookTitle
    });

    $scope.createPage = function () {
      var page = new Page();
      page.bookTitle = $scope.book.title;
      page.$save({
        bookTitle: $scope.book.title
      }, function (page) {
        $scope.book = Book.get({
          title: $routeParams.bookTitle
        });
      });
    };

    $scope.deletePage = function (pageNumber) {
      Page.delete({
        bookTitle: $scope.book.title,
        pageNumber: pageNumber
      }, function (res) {
        $scope.book = Book.get({
          title: $routeParams.bookTitle
        });
      });
    }
  }
]);

book.controller('BookEditCtrl', ['$scope', '$routeParams', 'Book',
  function ($scope, $routeParams, Book) {
    $scope.book = Book.get({
      title: $routeParams.bookTitle
    });

    $scope.saveEdit = function () {
      Book.update(null, {
        id: $scope.book._id,
        newAttrs: $scope.book
      }, function (res) {
        $scope.saveEditError = '';
        $scope.saveEditSuccess = 'Successfully updated book!';
      }, function (res) {
        $scope.saveEditError = res.data;
        $scope.saveEditSuccess = '';
      })
    }
  }
]);

book.controller('PageViewCtrl', ['$scope', '$routeParams', 'Page',
  function ($scope, $routeParams, Page) {
    var baseUrl;

    Page.get({
      bookTitle: $routeParams.bookTitle,
      pageNumber: $routeParams.pageNumber
    }, function (res) {
      $scope.page = res.page;
      $scope.pageCount = res.pageCount;
    });

    $scope.bookTitle = $routeParams.bookTitle;
    $scope.pageNumber = $routeParams.pageNumber;

    baseUrl = "#/book/" + $routeParams.bookTitle + "/page/";
    $scope.prevPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) - 1);
    $scope.editPageLink = baseUrl + parseInt($routeParams.pageNumber) + "/edit";
    $scope.nextPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) + 1);
  }
]);

book.controller('PageEditCtrl', ['$scope', '$routeParams', 'Page',
  function ($scope, $routeParams, Page) {
    var baseUrl;

    Page.get({
      bookTitle: $routeParams.bookTitle,
      pageNumber: $routeParams.pageNumber
    }, function (res) {
      $scope.page = res.page;
      $scope.pageCount = res.pageCount;
    });

    $scope.bookTitle = $routeParams.bookTitle;
    $scope.pageNumber = $routeParams.pageNumber;

    baseUrl = "#/book/" + $routeParams.bookTitle + "/page/";
    $scope.prevPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) - 1);
    $scope.viewPageLink = baseUrl + parseInt($routeParams.pageNumber);
    $scope.nextPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) + 1);

    $scope.savePage = function () {
      console.log($scope.page);
      console.log($scope.pageNumber);
      Page.update(null, {
          bookTitle: $scope.bookTitle,
          pageNumber: $scope.pageNumber,
          content: $scope.page
        },
        function (res) {
          console.log(res);
        });
    };
  }
]);

book.directive('compile', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function (value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);

        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
        
        MathJax.Hub.Typeset();
      }
    );
  };
}]);