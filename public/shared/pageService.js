'use strict';

var pageService = angular.module('crowdmath.pageService', ['ngResource']);

pageService.factory('Page', ['$resource',function ($resource) {
  return $resource('book/page', {}, {
    'update': {
      method: 'PUT'
    }
  });
}]);