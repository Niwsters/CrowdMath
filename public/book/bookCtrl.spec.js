describe('BookModel', function () {
  var $httpBackend,
      Page,
      Book,
      scope,
      bookCtrl;

  beforeEach(module('crowdmath.bookModel'));
  beforeEach(module('crowdmath.pageModel'));
  beforeEach(module('crowdmath.userModel'));
  beforeEach(module('crowdmath.bookCtrl'));

  // Mock states
  beforeEach(module(function ($stateProvider) {
    $stateProvider.state('404notfound', {url: '/'});
  }));

  // Mock services and initialize controller
  beforeEach(inject(function ($rootScope, $injector, $controller) {
    $httpBackend = $injector.get('$httpBackend');
    Page = $injector.get('Page');
    Book = $injector.get('Book');
    User = $injector.get('User');
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');

    scope = $rootScope.$new();

    bookCtrl = $controller('BookCtrl', {
      $scope: scope,
      $state: $state,
      $stateParams: $stateParams,
      Page: Page,
      Book: Book,
      User: User
    });
  }));

  describe('$scope.createPage()', function () {
    var bookPromise,
        page;
    beforeEach(function () {
      // Mock the book promise returned by Book.createPage
      page = {};
      bookPromise = {
        then: function (callback) {
          callback(page);
        }
      };

      // Mock Book.createPage
      Book.createPage = function () {};
      spyOn(Book, 'createPage').and.returnValue(bookPromise);
    });

    it('should be a defined function', function () {
      expect(scope.createPage).toBeDefined();
    });

    it('should call Book.createPage()', function () {
      scope.createPage();
      expect(Book.createPage).toHaveBeenCalled();
    });
    
    it('should push returned page to $scope.book.pages', function () {
      scope.createPage();
      expect(scope.book.pages).toContain(page);
    });
  });

});
