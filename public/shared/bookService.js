'use strict';

var bookService = angular.module('crowdmath.bookService', ['ngResource']);

bookService.factory('Book', ['$resource', 
	function($resource) {
		return $resource('book', {}, {});
	}
]);
