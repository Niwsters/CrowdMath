var iwmCreatePage = angular.module("iwmCreatePage", []);

iwmCreatePage.filter("uriencode", function() {
	"use strict";

	return encodeURIComponent;
});

iwmCreatePage.directive('addContentButton', function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'directives/add-content-button.html'
	};
});

iwmCreatePage.directive('createLinkButton', function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'directives/create-link-button.html'
	}
});

iwmCreatePage.directive('linkToPage', function() {
	"use strict";

	return {
		restrict: 'E',
		templateUrl: 'directives/link-to-page.html'
	};
});


iwmCreatePage.directive('contentInput', function($compile) {
	"use strict";

	return {
		restrict: 'E',
		scope: {
			content: '=',
			contentId: '@'
		},
		templateUrl: 'directives/content-input.html',
		link: function(scope) {
			scope.contentSelected = {
				text: true,
				math: false
			};

			scope.tempContent = {
				text: '',
				math: ''
			};

			scope.selectContent = function(type) {
				scope.contentSelected[type] = true;
				scope.content[scope.contentId].type = type;

				for(var key in scope.contentSelected) {
					if(key !== type) {
						scope.contentSelected[key] = false;
					}
				}
			}

			scope.$watch(function() {
				for(var key in scope.contentSelected) {
					if(scope.contentSelected[key] == true) {
						return scope.tempContent[key];
					}
				}
			}, function(newValue) {
				scope.content[scope.contentId].content = newValue;
			});
		}
	};
});

iwmCreatePage.directive('contentTextInput', function() {
	"use strict";

	return {
		template: '<textarea ng-model="tempContent.text"></textarea>'
	};
});

iwmCreatePage.directive('contentMathInput', function($compile) {
	"use strict";

	return {
		link: function(scope, elem) {
			// Add a mathquill-input (for TeX-like maths)

			var mathquillInput = angular.element('<mathquill-input ng-model="tempContent.math"></mathquill-input>');
			mathquillInput = $compile(mathquillInput)(scope);
			elem.append(mathquillInput);
		}
	};
});

// Angular directive for a mathquill "textarea"
// Credit: github.com/peardeck/mathquill-directive
iwmCreatePage.directive('mathquillInput', function($interval) {
	"use strict";
	
	return {
		restrict: 'E',
		template: '<span></span>',
		replace: true,
		require: 'ngModel',
		link: function(scope, elem, attrs, ngModel) {
			var mathquill = $(elem).mathquill('editable');

			var latexWatcher = $interval(function() {
				ngModel.$setViewValue(mathquill.mathquill('latex'));
			}, 500);

			scope.$on('$destroy', function() {
				$interval.cancel(latexWatcher);
			});

			ngModel.$render = function() {
				mathquill.mathquill('latex', ngModel.$viewValue || '');
			};
		}
	}
});

iwmCreatePage.controller("iwmCreatePageCtrl", function($scope, $compile) {
	"use strict";
	
	// The page object stores the content that the user creates.
	$scope.page = {
		content: []
	};

	// contentCount is an index for every added content.
	$scope.contentCount = 0;
	
	// Adds content inputs when the add content button is pressed.
	$scope.addContent = function() {
		var content = angular.element('<content-input content-id="'+$scope.contentCount+'" content="page.content"></content-input>');
		content = $compile(content)($scope);

		angular.element(document.querySelector('#create-content-container')).append(content);
		$scope.page.content[$scope.contentCount] = {};
		$scope.contentCount++;
	};
	
	// Hides the "View the page"-link by default.
	$scope.hideLinkToPage = true;
	
	// Links to the page viewer.
	$scope.link = window.location.href.toString().split(/.*\//)[0] + 'view-page.html#page=';
});
