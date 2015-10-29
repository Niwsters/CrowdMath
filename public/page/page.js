'use strict';

var page = angular.module('crowdmath.page', []);

page.controller('PageCtrl', ['$scope', '$state', '$stateParams', '$window', 'User', 'Book', 'Page', function ($scope, $state, $stateParams, $window, User, Book, Page) {
  var bookTitle,
    pageNumber,
    query,
    bookID,
    pageID;

  // Enable toggling of page editing mode
  $scope.pageEditMode = false;
  $scope.togglePageEditMode = function () {
    $scope.pageEditMode = !$scope.pageEditMode;
  };
  
  // TODO: Refactor this stuff into the states thingy. See bookmark on Naomi.  
  // Retrieve parameter variables
  bookID = $stateParams.bookID;
  bookTitle = $window.decodeURIComponent($stateParams.bookTitle);
  pageID = $stateParams.pageID;
  pageNumber = parseInt($stateParams.pageNumber);

  // Set up queries depending on parameters given
  if (bookTitle && pageNumber ) query = { bookTitle: bookTitle, pageNumber: pageNumber };
  if (pageID) query = { pageID: pageID };

  // Send to error page if query not set (as in, lacking parameters)
  if (!query) $state.transitionTo('404notfound');

  // Retrieve page and book data.
  Page.get(query, function (page) {
    $scope.page = page;
    $scope.book = page.book;
    $scope.bookTitle = page.book.title;
    $scope.pageCount = page.book.pages.length;
    
    // Retrieve pageNumber if not given
    if(pageNumber) {
      $scope.pageNumber = pageNumber;
    } else {
      $scope.pageNumber = _.findIndex(page.book.pages, function (pageRef) {
        return pageRef.id === page.id;
      });
    }

    // Check if user is author of book
    User.get(function (user) {
      $scope.isUserAuthor = page.book.owner === user._id || page.book.authors.indexOf(user._id) > -1;
    });

  });
  
  $scope.savePage = function () {
    $scope.globalMessages.saving = true;
    
    $scope.page.$update(
      function () {
        $scope.globalMessages.saving = false;
      },
      function () {
        $scope.globalMessages.saving = false;
      }
    );
  };
  
  // Allows sending global messages throughout the directives, such as when 
  // the page is saving or an error occurred.
  $scope.globalMessages = {};
  $scope.globalMessages.saving = false;
}]);


//TODO: Put all these directives in separate files.

page.directive('displayMath', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'displayMath' expression for changes
        return scope.$eval(attrs.displayMath);
      },
      function (value) {
        element.html('$$' + value + '$$');

        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
    );
  };
}]);

page.directive('inlineMath', ['$compile', function ($compile) {
  return function (scope, element, attrs) {
    scope.$watch(
      function (scope) {
        // watch the 'inlineMath' expression for changes
        return scope.$eval(attrs.inlineMath);
      },
      function (value) {
        element.html(value);

        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }
    );
  };
}]);

page.directive('pageNavigation', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'page/page-navigation.html'
  };
}]);

// Adds a toolbar (with position: fixed) for editing a book's page
page.directive('pageEditToolbar', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'page/page-edit-toolbar.html',
    link: function (scope, elem, attrs) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
  };
}]);

page.directive('pageComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/page-component.html',
    link: function (scope, elem, attrs) {
      scope.componentEditMode = false;

      scope.toggleEditComponentMode = function () {
        if (scope.pageEditMode) {
          scope.componentEditMode = !scope.componentEditMode;
        }
      };

      // Stop editing component if user stops editing page
      scope.$watch('pageEditMode', function (pageEditMode) {
        if (!pageEditMode) {
          scope.componentEditMode = false;
        }
      });

      scope.removeComponent = function () {
        scope.page.removeComponent(scope.component);
      };
      
      // Handle errors when saving component
      scope.backendError = '';
      scope.saveComponent = function () {
        scope.globalMessages.saving = true;
        
        scope.page.$update(
          function () {
            scope.backendError = '';
            scope.globalMessages.saving = false;
          },
          function () {
            scope.backendError = 'Sorry, something went wrong when saving the component!';
            scope.globalMessages.saving = false;
          }
        );
      };
    }
  };
}]);

page.directive('questionComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/question-component.html',
    link: function (scope, elem, attrs) {
      scope.showAnswer = false;
      scope.question = scope.component.content;

      scope.toggleShowAnswer = function () {
        if (!scope.pageEditMode) {
          scope.showAnswer = !scope.showAnswer;
        }
      };
    }
  };
}]);

page.directive('questionComponentEditor', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/question-component-editor.html'
  };
}]);

page.directive('autocorrectingComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/autocorrecting-component.html',
    link: function (scope, elem, attrs) {
      scope.givenAnswer = ''
      
      // More strict version of parseInt. 
      // Thanks to Mozzila at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt
      var filterInt = function (value) {
        if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
          return Number(value);
        return NaN;
      }
      
      // Give the user feedback depending on their answer
      scope.$watch('givenAnswer', function (givenAnswer) {
        if(givenAnswer) scope.feedbackStyle.visibility = 'visible';
        if(!givenAnswer) scope.feedbackStyle.visibility = 'hidden';
        
        givenAnswer = filterInt(givenAnswer);
        
        if(givenAnswer === scope.component.content.correctAnswer) {
          scope.isAnswerCorrect = true;
        } else {
          scope.isAnswerCorrect = false;
        }
      });
      
      // Make sure the correctAnswer is an integer
      scope.$watch('component.content.correctAnswer', function (newValue, oldValue) {
        if (newValue !== oldValue) {
          var parsedValue = filterInt(newValue);
          
          if(parsedValue) scope.component.content.correctAnswer = parsedValue
        }
      });
      
      scope.feedbackStyle = {
        visibility: 'hidden'
      };
    }
  };
}]);

page.directive('autocorrectingComponentEditor', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/autocorrecting-component-editor.html'
  };
}]);

page.directive('textComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/text-component.html'
  };
}]);

page.directive('textComponentEditor', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/text-component-editor.html'
  };
}]);

page.directive('mathComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/math-component.html'
  };
}]);

page.directive('mathComponentEditor', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/math-component-editor.html'
  };
}]);

page.directive('youtubeComponent', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    templateUrl: 'page/components/youtube-component.html',
    link: function (scope, elem, attrs) {
      scope.$watch('component.content', function (newValue, oldValue) {
        if (newValue) {
          scope.videoID = newValue.match(/https:\/\/(?:www.youtube.com|youtu.be)\/(?:watch\?v=|embed\/|)([\w\-]*)/)[1];
        }
      });
    }
  };
}]);

page.directive('youtubeComponentEditor', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/youtube-component-editor.html'
  };
}]);

// This directive creates an iframe for an embedded YouTube video
page.directive('youtube', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
        }
      });
    }
  };
});

page.directive('pathComponent', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'page/components/path-component.html'
  };
}]);

page.directive('pathComponentEditor', [function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'page/components/path-component-editor.html'
  };
}]);

// TODO: Refactor this. Seriously. Put the shit in the model or a factory,
// or something.
page.directive('pagePath', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/page-path.html',
    link: function (scope) {
      scope.pathEditMode = false;

      scope.setNextPageID = function (pageID) {
        scope.nextPageID = pageID;
      };

      console.log(scope.page.path);

      if (scope.page.path.type === 'question') {
        scope.questionPath = scope.page.path;
      } else {
        scope.questionPath = {
          type: 'question',
          question: 'What is love?',
          answers: [
            {
              text: "Baby don't hurt me",
              pageID: ''
            },
            {
              text: "Don't hurt me",
              pageID: ''
            },
            {
              text: "No more",
              pageID: ''
            }
          ]
        };
      }

      if (scope.page.path.type === 'simple') {
        scope.simplePath = scope.page.path;
      } else {
        scope.simplePath = {
          type: 'simple',
          pageID: ''
        };
      }

      scope.$watch('questionPath', function (questionPath) {
        if (scope.page.path.type === 'question') {
          scope.page.path = questionPath;
        }
      }, true);

      scope.$watch('simplePath', function (simplePath) {
        if (scope.page.path.type === 'simple') {
          scope.page.path = simplePath;
        }
      });

      scope.toggleEditPathMode = function () {
        if (scope.pageEditMode) {
          scope.pathEditMode = !scope.pathEditMode;
        }
      };

      // Stop editing path if user stops editing page
      scope.$watch('pageEditMode', function (pageEditMode) {
        if (!pageEditMode) {
          scope.pathEditMode = false;
        }
      });

      scope.savePath = function () {
        scope.page.$update(function () {
          scope.pathEditMode = false;
        });
      };

      scope.addPathAnswer = function () {
        scope.questionPath.answers.push({
          text: 'What is love?',
          pageID: ''
        });
      };

      scope.deletePathAnswer = function (index) {
        scope.questionPath.answers.splice(index, 1);
      };

      scope.setPathType = function (type) {
        if (type === 'simple') {
          scope.page.path = scope.simplePath;
        } else if (type === 'question') {
          scope.page.path = scope.questionPath;
        }
      };
    }
  };
}]);
