var angular = angular || "ERROR";

var iwmViewer = angular.module("iwmViewer", []);

/* 
 * Gets the hash parameter from the current URL.
 *
 * EXAMPLE:
 * getURLHash("param") returns "value" when the URL is http://website.com#param=value
 */
var getURLHash = function (parameterName) {
    "use strict";
    var sPageURL = window.location.hash.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    
    for (i = 0; i < sURLVariables.length; i += 1) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === parameterName) {
        
            return sParameterName[1];
        }
    }
};

/* Controller for view-math-problem.html */
iwmViewer.controller("iwmViewerCtrl", function ($scope) {
    "use strict";
    
    /* Get the problem object as a string from the hash in the URL and decode it (remove the %-stuff) */
    var problemString = decodeURIComponent(getURLHash("problem"));
    
    /* Generate the problem object from the string if it's defined.
     * Otherwise, create a problem with the title "Problem not found". */
    if (problemString) {
        $scope.problem = JSON.parse(problemString);
    } else {
        $scope.problem = {title: "Problem not found"};
    }
    
    /* If the problem's title is empty or undefined, set it to "Unnamed problem". */
    if ($scope.problem.title === "" || $scope.problem.title === undefined) {
        $scope.problem.title = "Unnamed problem";
    }
    
    /* Hides the answer on default */
    $scope.hideAnswer = true;
});