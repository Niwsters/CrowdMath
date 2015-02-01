/* This is just to make jslint stop nagging about imported scripts being undefined. */
/*global angular: false*/

var iwmCreator = angular.module("iwmCreator", []);

/* A filter that refers to encodeURIComponent. Not tested due to simplicity. */
iwmCreator.filter("uriencode", function () {
    "use strict";
    
    return encodeURIComponent;
});

/* Controller for create-math-problem.html */
iwmCreator.controller("iwmCreatorCtrl", function ($scope) {
    "use strict";
    
    /* Initialize $scope.problem so that at least an empty object is sent to the viewer */
    $scope.problem = {};
    
    /* Hides the link to the math problem viewer on initialization */
    $scope.hideLink = true;
    
    /* Set up the link to the math problem viewer. It doesn't include the $scope.problem variable because this is 
     * handled in the view. */
    $scope.link = window.location.protocol + "//" + window.location.host + "/src/html/view-math-problem.html#problem=";
});