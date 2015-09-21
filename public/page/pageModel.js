'use strict';

var pageModel = angular.module('crowdmath.pageModel', ['ngResource']);

pageModel.factory('Page', ['$resource', 'Book', function ($resource, Book) {
  var Page, page;
    
  Page = $resource('page', {}, {
    update: {
      method: 'PUT'
    }
  });

  page = Page.prototype;
  
  // REMOVE THIS?? I seriously need to add testing for these models...
  page.editMode = false;

  // -------------------------------------------
  // ------------ COMPONENT METHODS ------------ 
  // -------------------------------------------
  
  // Function that adds components
  page.addComponent = function (type, content) {
    this.components.push({
      type: type,
      content: content
    });
    this.$update();
  };
  
  // Function that moves components
  page.moveComponent = function (pos) {
    this.components.splice(pos, 1);
    this.$update();
  };
  
  // Function that removes components
  page.removeComponent = function (component) {
    this.components.splice(this.components.indexOf(component), 1);
    this.$update();
  };
  
  // More specific components
  page.addMathComponent = function () { this.addComponent('math', 'New math'); };
  page.addTextComponent = function () { this.addComponent('text', 'New text'); };
  page.addYouTubeComponent = function () { this.addComponent('youtube', ''); };
  page.addQuestionComponent = function () {
    this.addComponent('question', {question: 'Question', answer: 'Answer'});
  };
  page.addAutocorrectingComponent = function () {
    this.addComponent('autocorrecting', {question: 'What is 1 + 1?', correctAnswer: 2});
  };
  page.addPathComponent = function () {
    this.addComponent('path', { question: 'What is love?', answers: [
      { text: "Baby don't hurt me", path: '' },
      { text: "Don't hurt me", path: '' },
      { text: "No more", path: '' },
    ]});
  };
  
  return Page;
}]);
