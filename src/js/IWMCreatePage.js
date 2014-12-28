var iwmCreatePage = angular.module("iwmCreatePage", []);

iwmCreatePage.filter("uriencode", function() {
	"use strict";

	return encodeURIComponent;
});

iwmCreatePage.directive('addContentButton', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/add-content-button.html'
	};
});

iwmCreatePage.directive('createLinkButton', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/create-link-button.html'
	}
});

iwmCreatePage.directive('linkToPage', function() {
	return {
		restrict: 'E',
		templateUrl: 'directives/link-to-page.html'
	}
});

iwmCreatePage.controller("iwmCreatePageCtrl", function($scope, $compile) {
	"use strict";
	
	// The page object stores the content that the user creates.
	$scope.page = {};

	// contentCount is an index for every added content.
	$scope.contentCount = 0;
	
	// Adds content inputs when the add content button is pressed.
	$scope.addContent = function() {
		var content = angular.element('<textarea ng-model="page.content[' + $scope.contentCount + ']"></textarea><br\>');
		content = $compile(content)($scope);

		angular.element(document.querySelector('#create-content-container')).append(content);
		$scope.contentCount++;
	};
	
	// Hides the "View the page"-link by default.
	$scope.hideLinkToPage = true;
	
	// Links to the page viewer.
	$scope.link = window.location.href.toString().split(/.*\//)[0] + 'view-page.html#page=';
});
