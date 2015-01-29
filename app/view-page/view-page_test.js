'use strict';

describe('iwm.viewPage module', function() {

  beforeEach(module('iwm.viewPage'));

  describe('view-page controller', function(){
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
});