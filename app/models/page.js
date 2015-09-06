'use strict';

var mongoose = require('mongoose'),
    
    pageSchema,
    Page,
    containsOtherPropertiesThan;

pageSchema = mongoose.Schema({
  title: String,
  bookID: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  components: [ {} ], // Components are basically the content of the page; text, images, etc.
  path: {}, // The path is the special navigation for dynamic pages.
  defaultPathIndex: { type: Number, min: 0 }
});

Page = mongoose.model('Page', pageSchema);

Page.schema.path('components').validate(function (components) {
  var validations = {},
      validate,
      allowedContentProperties,
      i;
  
  // *******
  // Validation functions for each component type.
  // *******
  
  validations.text = function (component) {
    if (component.content.constructor !== String) return false;
    
    return true;
  };
  
  validations.math = function (component) {
    if (component.content.constructor !== String) return false;
    
    return true;
  };
  
  validations.question = function (component) {
    var allowedContentProperties = ['question', 'answer'];
    
    // Make sure content contains question and answer
    if (!component.content.question) return false;
    if (!component.content.answer) return false;
    
    // Make sure question and answer are both strings
    if (component.content.question.constructor !== String) return false;
    if (component.content.answer.constructor !== String) return false;
    
    // Validate that content doesn't contain other properties 
    // than question and answer
    if (containsOtherPropertiesThan(component.content, allowedContentProperties))
      return false;
    
    return true;
  };
  
  validations.youtube = function (component) {
    if (component.content.constructor !== String) return false;
    
    return true;
  };
  
  validations.autocorrecting = function (component) {
    var allowedContentProperties = ['question', 'answer'];
    
    // Make sure content contains both question and answer
    if (!component.content.question) return false;
    if (!component.content.answer) return false;
    
    // Make sure question is string and answer is number
    if (component.content.question.constructor !== String) return false;
    if (component.content.answer.constructor !== Number) return false;
    
    if (containsOtherPropertiesThan(component.content, allowedContentProperties))
      return false;
    
    return true;
  };
  
  // General validation function, for doing the validations 
  // the component types have in common.
  validate = function (component) {
    var property;
    
    if (!component.content) return false;
    if (!component.type) return false;
    
    // Check if component contains properties other than type and content
    if (containsOtherPropertiesThan(component, ['type', 'content'])) return false;
    
    return validations[component.type](component);
  };
  
  for (i = 0; i < components.length; i++) {
    var component = components[i];
    
    if (!validate(component)) return false;
  }
  
  return true;
}, 'Invalid component(s)');

Page.schema.path('path').validate(function (path) {
  var validations = {},
      validate;
  
  validations.simple = function (path) {
    if (!path.pageID && path.pageID !== '') return false;
    
    return true;
  };
  
  validations.question = function (path) {
    var i,
        allowedProperties,
        allowedAnswerProperties;
    
    // Allowed properties - validates to false if it path contains 
    // anything else than these.
    allowedProperties = ['type', 'question', 'answers'];
    allowedAnswerProperties = ['text', 'pageID'];
    
    // Make sure answers exists and is an array
    if (!path.answers) return false;
    if (path.answers.constructor !== Array) return false;
    
    // Make sure question exists and is a string
    if (!path.question) return false;
    if (path.question.constructor !== String) return false;
    
    // Make sure path contains no unnecessary properties
    if (containsOtherPropertiesThan(path, allowedProperties)) return false;
    
    // Validate the question's answers
    for (i=0; i<path.answers.length; i++) {
      // Make sure answer contains pageID and text
      if (!path.answers[i].pageID && path.answers[i].pageID !== '') return false;
      if (!path.answers[i].text) return false;
      
      // Make sure answer contains no unnecessary properties
      if(containsOtherPropertiesThan(path.answers[i], allowedAnswerProperties)) return false;
    }
    
    return true;
  };
  
  validate = function (path) {
    if(!path.type) return false;
    
    return validations[path.type](path);
  };
  
  return validate(path);
}, 'Invalid path');

// Checks if object contains other properties than the ones given.
containsOtherPropertiesThan = function(object, allowedProps) {
  var property;
  
  for (property in object) {
    if (object.hasOwnProperty(property)) {
      if (allowedProps.indexOf(property) === -1) return true;
    }
  }
  
  return false;
};

module.exports = Page;