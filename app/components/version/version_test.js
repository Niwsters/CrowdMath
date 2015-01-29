'use strict';

describe('iwm.version module', function() {
  beforeEach(module('iwm.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
