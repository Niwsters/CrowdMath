'use strict';

angular.module('iwm.version', [
  'iwm.version.interpolate-filter',
  'iwm.version.version-directive'
])

.value('version', '0.1');
