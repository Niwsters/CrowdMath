'use strict';

angular.module('iwm', [
  'ngRoute',
  'iwm.createPage',
  'iwm.viewPage',
  'iwm.version'
]).

config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/create-page'}); // The app's default page
}]);
