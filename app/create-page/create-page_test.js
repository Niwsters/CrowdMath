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
      it('should set content.content = textContent on textContent change', function() {
        $rootScope.content = {content: ''};
        $rootScope.textContent = '';
        $rootScope.mathContent = '';
        
        var elem = $compile('<content-input></content-input>')($rootScope);
        $rootScope.$digest();
        
        expect($rootScope.content.content).toEqual('');
        
        $rootScope.textContent = 'lol';
        $rootScope.$apply();
        
        expect($rootScope.content.content).toEqual($rootScope.textContent);
      });
      
      it('should set content.content = mathContent on mathContent change', function() {
        $rootScope.content = {content: ''};
        $rootScope.mathContent = '';
        
        var elem = $compile('<content-input></content-input>')($rootScope);
        $rootScope.$digest();
        
        expect($rootScope.content.content).toEqual('');
        
        $rootScope.mathContent = 'lol';
        $rootScope.$apply();
        
        expect($rootScope.content.content).toEqual($rootScope.mathContent);
      });
    });
    
    describe('mathquillInput', function() {
      it('should mathquill-ify itself', function() {
        var elem = $compile('<mathquill-input ng-model="test"></mathquill-input>')($rootScope);
        
        expect($(elem).mathquill('latex')).toBeDefined();
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
      //spec body
      expect(scope.page).toEqual({contents: []});
    }));
    
  });
});