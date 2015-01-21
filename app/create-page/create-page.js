'use strict';

angular.module('iwm.createPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create-page', {
    templateUrl: 'create-page/create-page.html',
    controller: 'CreatePageCtrl'
  });
}])

.controller('CreatePageCtrl', ['$scope', function($scope) {
  $scope.page = {
    contents: []
  }
}])

.filter("uriencode", function () {
	"use strict";

	return encodeURIComponent;
})

.directive('addContentButton', [function() {
  return {
    link: function(scope, elem, attrs) {
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

.directive('contentInput', [function() {
  return {
    templateUrl: 'create-page/content-input.html',
    link: function(scope, elem, attrs) {
      scope.$watch('textContent', function(newValue, oldValue) {
        scope.content.content = newValue;
      });
      
      scope.$watch('mathContent', function(newValue, oldValue) {
        scope.content.content = newValue;
      });
    }
  };
}])

.directive('mathquillElement', ['$interval', function($interval) {
  return {
    restrict: 'E',
    template: '<span></span>',
    replace: true,
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      var mathquill,
          latexWatcher;
      
      mathquill = $(elem).mathquill('editable');
      
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
      elem.bind('click', function() {
        scope.content.type = attrs.type;
        scope.$digest();
      });
    }
  };
}]);