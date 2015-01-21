'use strict';

// Declare app level module which depends on views, and components
angular.module('iwm', [
  'ngRoute',
  'iwm.createPage',
  'iwm.viewPage',
  'iwm.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/create-page'});
}]);
