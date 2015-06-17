/* describe('ProfileCtrl', function() {
	var scope, ctrl, User, defaultUser, otherUser, routeParams, Book, books;

	beforeEach(module('crowdmath'));

	beforeEach(inject(function($controller) {
		scope = {};
		defaultUser = {username: 'default'};
		otherUser = {username: 'otherUser'};
		routeParams = {};
		books = [];
		Book = function() {
			return {
				$save: function(func) {
					books.push(this);
					if(func) {
						func(this);
					}
				}
			}
		};
		User = {
			get: function(args) {
				if(args) {
					if(args.username === otherUser.username) {
						return otherUser;
					}
				}

				return defaultUser;
			}
		};
		ctrl = $controller('ProfileCtrl', {
			$scope: scope, 
			User: User, 
			$routeParams: routeParams,
			Book: Book
		});
	}));

	it('should set default user if no parameters are given', function() {
		expect(scope.user).toEqual(defaultUser);
	})

	it('should set given user if username parameter is given', inject(function($controller) {
		routeParams.username = otherUser.username;
		ctrl = $controller('ProfileCtrl', {$scope: scope, User: User, $routeParams: routeParams});
		expect(scope.user).toEqual(otherUser);
	}));

	it('should create function that creates a book in the database with title New book', function() {
		scope.createBook();
		expect(books[0].title).toEqual('New book');
	});

	it('should redirect to the newly created book after its creation', inject(function($controller) {
		var newPath = '',
				loc = {
					path: function(pathString) {
						newPath = pathString;
					}
				}
		$controller('ProfileCtrl', {$scope: scope, User: User, $routeParams: routeParams, $location: loc, Book: Book});
		scope.createBook();
		expect(newPath).toEqual('profile/' + User.get().username + '/book/' + books[0].title);
	}));
}); */
