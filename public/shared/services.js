'use strict';

var services = angular.module('crowdmath.services', ['ngResource']);

services.factory('Book', ['$resource', 'User', function ($resource, User) {
  var Book = $resource('book', {}, {
    update: {
      method: 'PUT'
    }
  });

  return Book;
}]);

services.factory('Books', ['$resource', function ($resource) {
  return $resource('books', {});
}]);

services.factory('User', ['$resource', function ($resource) {
  var User = $resource('user', {}, {});
  
  return User;
}]);

services.factory('Page', ['$resource', function ($resource) {
  var Page, page;
    
  Page = $resource('page', {}, {
    update: {
      method: 'PUT'
    }
  });
  
  page = Page.prototype;
  
  page.editMode = false;
  
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
    this.addComponent('autocorrecting', {question: 'What is 1 + 1?', answer: 2});
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