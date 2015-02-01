'use strict';

describe('iwm.viewPage', function() {

  beforeEach(module('iwm.viewPage'));

  describe('controller', function(){
    var scope, ctrl;
    
    beforeEach(inject(function($controller) {
      scope = {},
      ctrl = $controller('ViewPageCtrl', {$scope:scope});
    }));
    
    it('should ....', inject(function($controller) {
      //spec body
      expect(ctrl).toBeDefined();
    }));

  });

	describe('directives', function() {
		var $compile,
				$rootScope,
				$httpBackend;

		beforeEach(inject(function(_$compile_, _$rootScope_) {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
		}));

		describe('contentView', function() {
			
			it('should render text content as text', function() {
				var textToRender = "Blargh",
						elem;
				$rootScope.content = {type: "text", content: textToRender};
				elem = $compile('<div content-view></div>')($rootScope);
				$rootScope.$digest();

				expect(elem.text()).toEqual(textToRender);
			});

			it('should render math content as math', function() {
				var mathToRender = "x^2",
						elem;
				$rootScope.content = {type: "math", content: mathToRender};
				elem = $compile('<div content-view></div>')($rootScope);
				$rootScope.$digest();

				expect($(elem).mathquill('latex')).toEqual(mathToRender);
			})
		});
	});
});
