describe('BookModel', function () {
  var $httpBackend,
      Page,
      Book;

  beforeEach(module('crowdmath.bookModel'));
  beforeEach(module('crowdmath.pageModel'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Page = $injector.get('Page');
    Book = $injector.get('Book');
  }));

  describe('createPage()', function () {
    var book, page;

    beforeEach(function () {
      book = Book.one();
      book.id = 'some book ID';

      page = {
        save: function () {}, 
        addSimplePath: function () {}
      };

      spyOn(Page, 'new').and.returnValue(page);
    });

    it('should create a new page given its ID and save it to the backend', function () {
      spyOn(page, 'save');
      
      book.createPage();
      expect(Page.new).toHaveBeenCalledWith(book.id);
      expect(page.save).toHaveBeenCalled();
    });

    it('should call page.addSimplePath if book is dynamic', function () {
      spyOn(page, 'addSimplePath');
      
      book.dynamic = true;
      book.createPage();

      expect(page.addSimplePath).toHaveBeenCalled();
    });

    it('should return result from page.save()', function () {
      expectedReturnValue = 'page was saved';
      spyOn(page, 'save').and.returnValue(expectedReturnValue);

      expect(book.createPage()).toEqual(expectedReturnValue);
    });

  });

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

});
