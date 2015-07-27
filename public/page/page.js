page = angular.module('crowdmath.page', []);

page.controller('PageViewCtrl', ['$scope', '$state', '$stateParams', '$window', 'Page', function ($scope, $state, $stateParams, $window, Page) {
  var baseUrl,
    bookTitle,
    pageNumber = parseInt($stateParams.pageNumber);

  if ($stateParams.bookTitle) {
    bookTitle = $window.decodeURIComponent($stateParams.bookTitle);
  } else {
    $state.transitionTo('404notfound');
  }

  // Retrieve page using route parameters.
  Page.get({
    bookTitle: bookTitle,
    pageNumber: pageNumber
  }, function (res) {
    $scope.page = res.page;
    $scope.pageCount = parseInt(res.pageCount);
  });

  // Set bookTitle and pageNumber scope variables using route parameters.
  $scope.bookTitle = bookTitle;
  $scope.pageNumber = parseInt($stateParams.pageNumber);

  $scope.editPageMode = false;

  // Create a savePage function for saving the edited content.
  $scope.savePage = function () {
    Page.update(null, {
        bookTitle: $scope.bookTitle,
        pageNumber: $scope.pageNumber,
        content: $scope.page
      },
      function (res) {});
  };
  
  $scope.moveComponent = function (pos) {
    $scope.page.splice(pos, 1);
    $scope.savePage();
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

  $scope.addYouTube = function () {
    $scope.page.push({
      type: 'youtube',
      content: ''
    });
  };
  
  $scope.addAutocorrecting = function () {
    $scope.page.push({
      type: 'autocorrecting',
      content: {
        question: 'What is 1 + 1?',
        correctAnswer: '2'
      }
    });
  }
}]);

page.directive('compileMath', ['$compile', function ($compile) {
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
    replace: true,
    templateUrl: 'page/components/page-component.html',
    link: function (scope, elem, attrs) {
      scope.editComponentMode = false;

      scope.toggleEditComponentMode = function () {
        if (scope.editPageMode) {
          scope.editComponentMode = !scope.editComponentMode;
        }
      };

      scope.$watch('editPageMode', function (newValue) {
        if (!newValue) {
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

page.directive('questionComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/question-component.html',
    link: function (scope, elem, attrs) {
      scope.showAnswer = false;
      scope.question = scope.component.content;

      scope.toggleShowAnswer = function () {
        if (!scope.editPageMode) {
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

page.directive('autocorrectingComponent', [function() {
  return {
    restrict: 'E',
    templateUrl: 'page/components/autocorrecting-component.html'
  }
}]);

page.directive('autocorrectingComponentEditor', [function() {
  return {
    restrict: 'E',
    templateUrl: 'page/components/autocorrecting-component-editor.html'
  }
}]);

page.directive('textComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/text-component.html'
  };
}]);

page.directive('mathComponent', [function () {
  return {
    restrict: 'E',
    templateUrl: 'page/components/math-component.html'
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
          console.log(scope.videoID);
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

Array.prototype.moveUp = function (value, by) {
  var index = this.indexOf(value),
    newPos = index - (by || 1);

  if (index === -1)
    throw new Error("Element not found in array");

  if (newPos < 0)
    newPos = 0;

  this.splice(index, 1);
  this.splice(newPos, 0, value);
};

Array.prototype.moveDown = function (value, by) {
  var index = this.indexOf(value),
    newPos = index + (by || 1);

  if (index === -1)
    throw new Error("Element not found in array");

  if (newPos >= this.length)
    newPos = this.length;

  this.splice(index, 1);
  this.splice(newPos, 0, value);
};
