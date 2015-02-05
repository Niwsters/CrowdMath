'use strict';

describe('iwm.createPage', function() {

  beforeEach(module('iwm.createPage'));
  
  beforeEach(module('templates'));
  
  describe('directives', function() {
    var $compile,
        $rootScope,
        $httpBackend;
    
    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));
    
    describe('addContentButton', function() {
      it('should add content object to scope.page.contents when clicked', function() {
        $rootScope.page = {contents: []};
        var elem = $compile('<button add-content-button></button>')($rootScope);

        $rootScope.$digest();

        elem.triggerHandler('click');

        expect($rootScope.page.contents[0]).toEqual({type: 'text', content: ''});
      });
    });
    
    describe('contentInput', function() {
			it("should set content.content = inputContent.<type> on inputContent change", function() {
				var	elem;
				$rootScope.content = {type: 'type1', content: ''};
				$rootScope.inputContent = {type1: 'Blargh'};
				elem = $compile('<content-input></content-input>')($rootScope);
				$rootScope.$digest();

				expect($rootScope.content.content).toBe($rootScope.inputContent.type1);

				$rootScope.inputContent.type2 = 'Honk';
				$rootScope.content.type = 'type2';
				$rootScope.$digest();
				expect($rootScope.content.content).toBe($rootScope.inputContent.type2);
			});
	
			it('should set content.content = inputContent.<type> on content type change', function() {
				var elem;

				$rootScope.inputContent = {
					type1: 'x^2',
					type2: 'Blargh'
				}
				
				$rootScope.content = {type: 'type1', content: $rootScope.inputContent.type1};

				elem = $compile('<content-input></content-input>')($rootScope);
				$rootScope.$digest();

				expect($rootScope.content.content).toBe($rootScope.inputContent.type1);

				$rootScope.content.type = 'type2';
				$rootScope.$digest();

				expect($rootScope.content.content).toBe($rootScope.inputContent.type2);
			})
    });
    
    describe('mathquillInput', function() {
      it('should mathquill-ify itself', function() {
        var elem = $compile('<mathquill-input ng-model="test"></mathquill-input>')($rootScope);
        
        expect($(elem).mathquill('latex')).toBeDefined();
      });
    });

    describe('chooseContent', function() {
      it('should set content.type to type attribute when clicked', function() {
        $rootScope.content = {type: 'type1'};
        var elem = $compile('<button choose-content type="type2"></button>')($rootScope);
        $rootScope.$digest();
				
        expect($rootScope.content.type).toEqual("type1");
        elem.triggerHandler('click');
        $rootScope.$digest();
        expect($rootScope.content.type).toEqual("type2");
      });
    });
    
    describe('questionInput', function() {
      it('should initialize model object', function() {
        var elem = $compile('<question-input ng-model="model"></question-input>')($rootScope);
        $rootScope.$digest();
        
        expect($rootScope.model).toEqual({question: '', answer: ''});
      });
    });
  });
  
  describe('controller', function() {
    var scope, ctrl;
    
    beforeEach(inject(function($controller) {
      scope = {},
      ctrl = $controller('CreatePageCtrl', {$scope:scope});
    }));
    
    it('should create an empty page object', inject(function($controller) {
      expect(scope.page).toEqual({contents: []});
    }));
    
  });
});
