var angular = angular || "ERROR";

var iwmViewPage = angular.module("iwmViewPage", ['ngSanitize']);

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

iwmViewPage.filter("newline", function() {
	"use strict";

	return function(input) {
		return input.replace(/(?:\r\n|\r|\n)/g, '<br\>');
	}
})

/* Controller used in view-page.html */
iwmViewPage.controller("iwmViewPageCtrl", function ($scope) {
    "use strict";
    
    /* ----- CREATE THE PAGE FROM URL ----- */
    /* Get the page object as a string from the hash */
    var pageURIString = getURLHash("page");
    
    /* Generate the page object from the string if it's defined.
     * Otherwise, create an empty default page */
    if (pageURIString) {
        $scope.page = JSON.parse(decodeURIComponent(pageURIString));
    } else {
        $scope.page = {
		component: {
			"0": "This page is empty"
		}
        };
    }
});
