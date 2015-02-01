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
				$rootScope.$digest();
				expect($rootScope.content.content).toBe($rootScope.inputContent.type2);
			});

      it('should set content.content = textContent on textContent change', function() {
        $rootScope.content = {type: "text", content: ''};
        $rootScope.textContent = '';
        $rootScope.mathContent = '';
        
        var elem = $compile('<content-input></content-input>')($rootScope);
        $rootScope.$digest();
        
        expect($rootScope.content.content).toEqual('');
        
        $rootScope.textContent = 'lol';
        $rootScope.$apply();
        
        expect($rootScope.content.content).toEqual($rootScope.textContent);
      });

			it("shouldn't set content.content = textContent if content.type isn't 'text'", function() {
				var elem;
				$rootScope.content = {type: 'math', content: 'x^2'};
				elem = $compile('<content-input></content-input>');
				$rootScope.$digest();

				$rootScope.textContent = 'blargh';
				$rootScope.$digest();

				expect($rootScope.content.content).toEqual('x^2');
			});
      
      it('should set content.content = mathContent on mathContent change', function() {
        $rootScope.content = {type: 'math', content: ''};
        $rootScope.mathContent = '';
        
        var elem = $compile('<content-input></content-input>')($rootScope);
        $rootScope.$digest();
        
        expect($rootScope.content.content).toEqual('');
        
        $rootScope.mathContent = 'lol';
        $rootScope.$apply();
        
        expect($rootScope.content.content).toEqual($rootScope.mathContent);
      });

			it('should set content.content = <type>Content on content type change', function() {
				var elem;
				
				$rootScope.mathContent = 'x^2';
				$rootScope.textContent = 'Blargh';
				$rootScope.content = {type: 'text', content: 'Blargh'};

				elem = $compile('<content-input></content-input>')($rootScope);
				$rootScope.$digest();

				expect($rootScope.content.content).toBe($rootScope.textContent);

				$rootScope.content.type = 'math';
				$rootScope.$digest();
				expect($rootScope.content.content).toBe($rootScope.mathContent);
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
				$rootScope.content = {type: "type1"};
				var elem = $compile('<button choose-content type="type2"></button>')($rootScope);
				$rootScope.$digest();
				
				expect($rootScope.content.type).toEqual("type1");
				elem.triggerHandler('click');
				$rootScope.$digest();
				expect($rootScope.content.type).toEqual("type2");
			})
		})
  });
  
  describe('controller', function() {
    var scope, ctrl;
    
    beforeEach(inject(function($controller) {
      scope = {},
      ctrl = $controller('CreatePageCtrl', {$scope:scope});
    }));
    
    it('should create an empty page object', inject(function($controller) {
      //spec body
      expect(scope.page).toEqual({contents: []});
    }));
    
  });
});
