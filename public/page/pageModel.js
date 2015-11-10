'use strict';

var pageModel = angular.module('crowdmath.pageModel', ['restangular']);

pageModel.factory('Page', ['Restangular', function (Restangular) {
  var Page, page, route = 'page';

  Page = Restangular.service(route);

  Page.new = function(bookID) {
    var page = Page.one();

    page.bookID = bookID;

    return page;
  }
  
  // -------------------------------------------
  // ------------ COMPONENT METHODS ------------ 
  // -------------------------------------------

  Restangular.extendModel(route, function (page) {
    // Function that adds components
    page.addComponent = function (type, content) {
      this.components.push({
        type: type,
        content: content
      });

      this.put();
    };

    page.addSimplePath = function () {
      page.path = {
        type: 'simple',
        pageID: ''
      }
    };
     
    // Function that removes components
    page.removeComponent = function (arg) {
      var index;

      if (typeof arg === "number") {
        index = arg;
      } else {
        index = this.components.indexOf(arg);
      }

      this.components.splice(index, 1);
      this.put();
    };
    
    // More specific components
    page.addMathComponent = function () { this.addComponent('math', 'New math'); };
    page.addTextComponent = function () { this.addComponent('text', 'New text'); };
    page.addYouTubeComponent = function () { this.addComponent('youtube', ''); };
    page.addQuestionComponent = function () {
      this.addComponent('question', {question: 'Question', correctAnswer: 'Answer'});
    };
    page.addAutocorrectingComponent = function () {
      this.addComponent('autocorrecting', {question: 'What is 1 + 1?', correctAnswer: 2});
    }; 

    return page;
  });
  
  return Page;
}]);
