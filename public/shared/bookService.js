'use strict';

var bookService = angular.module('crowdmath.bookService', ['ngResource']);

bookService.factory('Book', ['$resource', 
	function($resource) {
		return $resource('book', {}, {
          'update': { method: 'PUT' }
        });
	}
]);

bookService.factory('Page', ['$resource',
    function($resource) {
      return $resource('book/page', {}, {
        'update' : { method: 'PUT' }
      });
    }
]);
