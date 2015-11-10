describe('UserModel', function () {
  var $httpBackend,
      BookResource;

  beforeEach(module('crowdmath.userModel'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    User = $injector.get('User');
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('isAuthor', function () {
    var book, user, isAuthor;
    beforeEach(function () {
      user = {
        _id: "some user ID"
      };

      book = {};

      $httpBackend.expect('GET', 'user').respond(200, {_id: user._id});
    });

    it('should return true if user is author of given book', function () {
      book.authors = [user._id];

      User.isAuthor(book, function (res) {
        isAuthor = res;
      });

      $httpBackend.flush();

      expect(isAuthor).toBe(true);
    });

    it('should return false if user is not author of given book', function () {
      book.authors = [];

      User.isAuthor(book, function (res) {
        isAuthor = res;
      });

      $httpBackend.flush();

      expect(isAuthor).toBe(false);
    });
  });
});
