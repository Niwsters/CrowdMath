'use strict';

angular.module('iwm.viewPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view-page/:page', {
    templateUrl: 'view-page/view-page.html',
    controller: 'ViewPageCtrl'
  });
}])

.controller('ViewPageCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
	// If the route parameter 'page' is defined, 
	// decode and parse it into a page object.
  if($routeParams.page !== undefined) {
		var pageURI = decodeURIComponent($routeParams.page);
		if(pageURI !== undefined) {
			$scope.page = JSON.parse(pageURI);
		}
  }
}])

.directive('contentView', [function() {
  return {
    template: '<div ng-bind="content.content"></div>',
    link: function(scope, elem, attrs) {
      if(scope.content.type === 'math') {
        elem.text(scope.content.content);
        $(elem).mathquill();
      }
    }
  };
}]);
