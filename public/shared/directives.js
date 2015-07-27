var directives = angular.module('crowdmath.directives', []);

directives.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                var $script = angular.element("<script type='math/tex'>")
                    .html(value == undefined ? "" : value);
                $element.html("");
                $element.append($script);
                MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
            });
        }]
    };
});

directives.directive('disabled-link', function() {
  return {
    restrict: 'C',
    compile: function(tElement, tAttrs, transclude) {
      //Disable ngClick
      tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";

      //return a link function
      return function (scope, iElement, iAttrs) {

        //Toggle "disabled" to class when aDisabled becomes true
        scope.$watch(iAttrs["aDisabled"], function(newValue) {
          if (newValue !== undefined) {
            iElement.toggleClass("disabled", newValue);
          }
        });

        //Disable href on click
        iElement.on("click", function(e) {
          if (scope.$eval(iAttrs["aDisabled"])) {
            e.preventDefault();
          }
        });
      };
    }
  };
});