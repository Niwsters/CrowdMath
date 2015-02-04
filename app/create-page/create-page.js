'use strict';

angular.module('iwm.createPage', ['ngRoute'])

// Sets the route to the create page
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create-page', {
    templateUrl: 'create-page/create-page.html',
    controller: 'CreatePageCtrl'
  });
}])

.controller('CreatePageCtrl', ['$scope', function($scope) {
  
  // Prepare empty page object to fill with content
  $scope.page = {
    contents: []
  }
  
}])

// Filter that converts a string to a link-friendly string
.filter("uriencode", function () {
	return encodeURIComponent;
})

// Button directive that adds content to the page
.directive('addContentButton', [function() {
  return {
    link: function(scope, elem, attrs) {
      
      // Add new content to page object on click event
      elem.bind('click', function() {
        scope.page.contents.push({
          type: "text",
          content: ""
        });
        
        scope.$apply();
      });
      
    }
  };
}])

// Directive that contains all the inputs (text, math, etc) for each content
.directive('contentInput', [function() {
  return {
    restrict: 'E',
    templateUrl: 'create-page/content-input.html',
    link: function(scope, elem, attrs) {

      scope.inputContent = {};

      scope.$watch('inputContent', function(newValue, oldValue) {
        scope.content.content = scope.inputContent[scope.content.type];
      }, true);

      scope.$watch('content.type', function(newValue, oldValue) {
        if(newValue !== oldValue) {
          scope.content.content = scope.inputContent[scope.content.type];
        }
      });

    }
  };
}])

// Directive for a mathquill-ified input (WYSIWYG LaTeX math input, basically)
.directive('mathquillInput', ['$interval', function($interval) {
  return {
    restrict: 'E',
    template: '<span></span>',
    replace: true,
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      var mathquill,
          latexWatcher;
      
      // Mathquill-ify the element
      mathquill = $(elem).mathquill('editable');
      
      // Make sure the model (set with ng-model attribute) is updated,
      // since mathquill doesn't use a traditional input.
			// TODO: TEST THE NG-MODEL
      latexWatcher = $interval(function () {
        ngModel.$setViewValue(mathquill.mathquill('latex'));
      }, 500);
      
      scope.$on('$destroy', function () {
        $interval.cancel(latexWatcher);
      });
      
      ngModel.$render = function () {
        mathquill.mathquill('latex', ngModel.$viewValue || '');
      };
    }
  };
}])

.directive('chooseContent', [function() {
  return {
    link: function(scope, elem, attrs) {
			// When element is clicked, set the content 
			// type to the element's "type" attribute.
      elem.bind('click', function() {
        scope.content.type = attrs.type;
        scope.$digest();
      });
    }
  };
}]);
