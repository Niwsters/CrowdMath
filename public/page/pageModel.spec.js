describe('PageModel', function () {
  var $httpBackend,
      Restangular,
      Page,
      page,
      type,
      content;

  beforeEach(module('crowdmath.pageModel'));

  beforeEach(inject(function ($injector) {
    $httpBackend = $injector.get('$httpBackend');
    Restangular = $injector.get('Restangular');
    Page = $injector.get('Page');
  }));

  beforeEach(function () {
    page = Restangular.one('page');
    page.components = [];

    type = 'some type';
    content = 'some content';
  });

  describe('addComponent()', function () {
    var expectedComponent;

    it('should add a component to the page with given type and content', function () {
      expectedComponent = {type: type, content: content};

      page.addComponent(type, content);

      expect(page.components).toContain(expectedComponent);
    });

    it('should call PUT page after component is added', function () {
      // Restangular doesn't include all the custom methods in the PUT request,
      // therefore we remove it in the expected page. It's a good thing!
      expectedPage = {components:[{type: type, content: content}]};

      // Restangular expects the response to be the updated page.
      $httpBackend.expectPUT('/page', expectedPage).respond(200, expectedPage);

      page.addComponent(type, content);

      $httpBackend.flush();

      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
  });

  describe('removeComponent()', function () {
    var component1,
        component2;

    beforeEach(function () {
      component1 = 'first component';
      component2 = 'second component';

      page.components.push(component1);
      page.components.push(component2);
    });

    it('should remove component on given position', function () {
      page.removeComponent(0);

      expect(page.components).not.toContain(component1);
      expect(page.components).toContain(component2);
    });

    it('should remove given component', function () {
      page.removeComponent(component2);

      expect(page.components).not.toContain(component2);
      expect(page.components).toContain(component1);
    });
  });

  describe('add###Component()', function () {
    // This object describes all the default components that can be 
    // added to the page object
    var expectedComponents = {
      'Math': {
        type: 'math',
        content: 'New math'
      },
      'Text': {
        type: 'text',
        content: 'New text'
      },
      'YouTube': {
        type: 'youtube',
        content: ''
      },
      'Question': {
        type: 'question',
        content: {
          question: 'Question',
          correctAnswer: 'Answer'
        }
      },
      'Autocorrecting': {
        type: 'autocorrecting',
        content: {
          question: 'What is 1 + 1?',
          correctAnswer: 2
        }
      },
    }, type;

    for (type in expectedComponents) {
      describe('add' + type + 'Component()', function () {
        it('should call addComponent with proper component type and content', function () {
          spyOn(page, 'addComponent');

          page['add' + type + 'Component']();

          expectedType = expectedComponents[type].type;
          expectedContent = expectedComponents[type].content;

          expect(page.addComponent).toHaveBeenCalledWith(expectedType, expectedContent);
        });
      });
    }
  });

  describe('new()', function () {
    var page, bookID;

    beforeEach(function () {
      bookID = 'some book ID';

      spyOn(Page, 'one').and.returnValue({});
    });

    it('should return new page object with given book ID', function () {
      page = Page.new(bookID);

      expect(page).toEqual({bookID: bookID});
    });
    
  });

  describe('addSimplePath', function () {
    var page, expectedPath;

    it('should add a simple path object to page.path', function () {
      page = Page.one();

      expectedPath = {
        type: 'simple',
        pageID: ''
      }

      page.addSimplePath();

      expect(page.path).toEqual(expectedPath);
    });
  });

});
