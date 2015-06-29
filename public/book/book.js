'use strict';

var book = angular.module('crowdmath.book', []);

book.controller('BookViewCtrl', ['$scope', '$routeParams', 'Book', 'Page',
  function ($scope, $routeParams, Book, Page) {
    
    // Retrieve book from database using the book title in the route
    $scope.book = Book.get({
      title: $routeParams.bookTitle
    });
    
    // Create a createPage function for creating a page in the view
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
    
    // Create a deletePage function for deleting a page in the view
    $scope.deletePage = function (pageNumber) {
      Page.delete({
        bookTitle: $scope.book.title,
        pageNumber: pageNumber
      }, function (res) {
        $scope.book = Book.get({
          title: $routeParams.bookTitle
        });
      });
    };
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
    
    // Retrieve page using route parameters.
    Page.get({
      bookTitle: $routeParams.bookTitle,
      pageNumber: $routeParams.pageNumber
    }, function (res) {
      $scope.page = res.page;
      $scope.pageCount = res.pageCount;
    });
    
    // Set bookTitle and pageNumber scope variables using route parameters.
    $scope.bookTitle = $routeParams.bookTitle;
    $scope.pageNumber = $routeParams.pageNumber;
    
    // Create dynamic links to use in the view.
    baseUrl = "#/book/" + $routeParams.bookTitle + "/page/";
    $scope.prevPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) - 1);
    $scope.nextPageLink = baseUrl + parseInt(parseInt($routeParams.pageNumber) + 1);
    
    $scope.editPageMode = false;
    
    // Create a savePage function for saving the edited content.
    $scope.savePage = function () {
      Page.update(null, {
          bookTitle: $scope.bookTitle,
          pageNumber: $scope.pageNumber,
          content: $scope.page
        },
        function (res) {
        });
    };
    
    $scope.addMath = function () {
      $scope.page.push({
        type: 'math',
        content: 'New math'
      });
    };
    
    $scope.addText = function () {
      $scope.page.push({
        type: 'text',
        content: 'New text'
      });
    };
    
    $scope.addQuestion = function () {
      $scope.page.push({
        type: 'question',
        content: {
          question: 'question',
          correctAnswer: 'answer'
        }
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

book.directive('compileMath', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'compileMath' expression for changes
        return scope.$eval(attrs.compileMath);
      },
      function (value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html('$$' + value + '$$');
        
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
    );
  };
}]);

book.directive('pageNavigation', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'book/page-navigation.html'
  };
}]);

// Adds a toolbar (with position: fixed) for editing a book's page
book.directive('pageEditToolbar', [function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'book/page-edit-toolbar.html',
    link: function (scope, elem, attrs) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
  };
}]);

book.directive('pageComponent', [function() {
  return {
    restrict: 'E',
    templateUrl: 'book/components/page-component.html',
    link: function (scope, elem, attrs) {
      scope.editComponentMode = false;
      
      scope.toggleEditComponentMode = function () {
        if(scope.editPageMode) {
          scope.editComponentMode = !scope.editComponentMode;
        }
      };
      
      scope.$watch('editPageMode', function (newValue) {
        if(!newValue) {
          scope.editComponentMode = false;
        }
      });
      
      scope.saveComponent = function () {
        scope.editComponentMode = false;
        
        scope.savePage();
      };
      
      scope.removeComponent = function () {
        scope.page.splice(scope.page.indexOf(scope.component), 1);
        
        scope.savePage();
      };
      
      scope.moveComponentUp = function () {
        scope.page.moveUp(scope.component);
        
        scope.savePage();
      };
      
      scope.moveComponentDown = function () {
        scope.page.moveDown(scope.component);
        
        scope.savePage();
      };
    }
  };
}]);

book.directive('questionComponent', [function() {
  return {
    restrict: 'E',
    templateUrl: 'book/components/question-component.html',
    link: function(scope, elem, attrs) {
      scope.showAnswer = false;
      scope.question = scope.component.content;
      
      scope.toggleShowAnswer = function () {
        if(!scope.editPageMode) {
          scope.showAnswer = !scope.showAnswer;
        }
      };
    }
  };
}]);

book.directive('textComponent', [function() {
  return {
    restrict: 'E',
    templateUrl: 'book/components/text-component.html'
  };
}])

book.directive('mathComponent', [function() {
  return {
    restrict: 'E',
    templateUrl: 'book/components/math-component.html'
  };
}]);

book.directive('questionComponentEditor', [function() {
  return {
    restrict: 'E',
    templateUrl: 'book/components/question-component-editor.html'
  };
}]);

Array.prototype.moveUp = function(value, by) {
    var index = this.indexOf(value),     
        newPos = index - (by || 1);
    
    if(index === -1) 
        throw new Error("Element not found in array");
    
    if(newPos < 0) 
        newPos = 0;
        
    this.splice(index,1);
    this.splice(newPos,0,value);
};

Array.prototype.moveDown = function(value, by) {
    var index = this.indexOf(value),     
        newPos = index + (by || 1);
    
    if(index === -1) 
        throw new Error("Element not found in array");
    
    if(newPos >= this.length) 
        newPos = this.length;
    
    this.splice(index, 1);
    this.splice(newPos,0,value);
};