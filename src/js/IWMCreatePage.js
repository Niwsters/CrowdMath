

var iwmCreatePage = angular.module("iwmCreatePage", []);

iwmCreatePage.controller("iwmCreatePageCtrl", function($scope, $element) {
	"use strict";
	
	$scope.addComponent = function() {
		var component = angular.element('<textarea></textarea><br\>');
		$element.find("container").append(component);
	};
});
