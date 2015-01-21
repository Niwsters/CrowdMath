'use strict';

angular.module('iwm.viewPage', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view-page/:page', {
    templateUrl: 'view-page/view-page.html',
    controller: 'ViewPageCtrl'
  });
}])

.controller('ViewPageCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
  $scope.page = JSON.parse(decodeURIComponent($routeParams.page));
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