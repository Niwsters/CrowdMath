var bookModel = angular.module('crowdmath.bookModel', ['restangular']);
  

bookModel.factory('Book', ['Restangular', 'Page', function(Restangular, Page) {
  var Book, route = 'book';

  Book = Restangular.service(route);

  Restangular.extendModel(route, function (book) {
    book.createPage = function () {
      var page = Page.new(book.id);

      if (book.dynamic) page.addSimplePath();

      return page.save();
    }

    return book;
  });
 
  return Book;
}]);

bookModel.factory('Books', ['$resource', function ($resource) {
  return $resource('books', {});
}]);
