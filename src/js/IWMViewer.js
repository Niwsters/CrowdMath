var angular = angular || "ERROR";

var iwmViewer = angular.module("iwmViewer", []);

/* Gets the hash parameter from the current URL.
 * EXAMPLE: getURLHash("param") returns "value" when the URL is http://website.com#param=value
 */
var getURLHash = function (parameterName) {
    "use strict";
    var hashString,
        hashArgs,
        hashArg,
        i;
    
    /* Return false if there's no "#" at all. 
     * This is not testable in Jasmine. */
    if (location.href.search("#") === -1) {
        return false;
    }
    
    /* Retrieve the string after "#" */
    hashString = location.href.split("#")[1];
    
    /* Return false if there's nothing after "#" */
    if (hashString.length === 0) {
        return false;
    }
    
    /* Split the hash string into an array */
    hashArgs = hashString.split('&');
    
    /* Find the hash we're looking for and return its value */
    for (i = 0; i < hashArgs.length; i += 1) {
        hashArg = hashArgs[i].split('=');
        if (hashArg[0] === parameterName) {
            return hashArg[1];
        }
    }
    
    /* Return false if the hash we're looking for wasn't found */
    return false;
};

/* Controller used in view-math-problem.html */
iwmViewer.controller("iwmViewerCtrl", function ($scope) {
    "use strict";
    
    /* ----- CREATE THE PROBLEM FROM URL ----- */
    /* Get the problem object as a string from the hash */
    var problemURIString = getURLHash("problem");
    
    /* Generate the problem object from the string if it's defined.
     * Otherwise, create a problem with the title "Problem not found". */
    if (problemURIString) {
        $scope.problem = JSON.parse(decodeURIComponent(problemURIString));
    } else {
        $scope.problem = {
            title: "Problem not found",
            answer: "0"
        };
    }
    
    /* If the problem's answer is empty or undefined, set it to "Undefined answer" */
    if ($scope.problem.answer === "" || $scope.problem.answer === undefined) {
        $scope.problem.answer = "Undefined answer";
    }
    
    /* Check if the problem contains only numbers */
    $scope.isAnswerANumber = /^\d+$/.test($scope.problem.answer);
    
    /* If the problem's title is empty or undefined, set it to "Unnamed problem" */
    if ($scope.problem.title === "" || $scope.problem.title === undefined) {
        $scope.problem.title = "Unnamed problem";
    }
    
    /* Hides the answer on default */
    $scope.hideAnswer = true;
    
    /* Checks if the submitted answer is correct 
       when the problem's answer contains only numbers */
    $scope.checkAnswer = function () {
        if ($scope.submittedAnswer !== "") {
            $scope.answerSubmitted = true;
        } else {
            $scope.answerSubmitted = false;
        }
        
        if ($scope.problem.answer === $scope.submittedAnswer) {
            $scope.answerCorrect = true;
        } else {
            $scope.answerCorrect = false;
        }
    };
});