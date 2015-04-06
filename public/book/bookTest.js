describe('BookCtrl', function() {
	var scope, ctrl, testBook, Book;

	beforeEach(module('crowdmath'));

	beforeEach(inject(function($controller) {
		scope = {};
		// Mock the Book service
		testBook = {title: 'testBook'};
		Book = {
			get: function(args) {
				return testBook;
			}
		};
		ctrl = $controller('BookCtrl', {$scope: scope, Book: Book});
	}));

	it('creates a book variable in scope', function() {
		expect(scope.book).toEqual(testBook);
	})
});
