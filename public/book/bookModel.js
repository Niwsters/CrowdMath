var bookModel = angular.module('crowdmath.bookModel', ['ngResource']);

bookModel.factory('Book', ['$resource', function ($resource, User) {
  var Book = $resource('book', {}, {
    update: {
      method: 'PUT'
    }
  });

  return Book;
}]);

bookModel.factory('Books', ['$resource', function ($resource) {
  return $resource('books', {});
}]);
