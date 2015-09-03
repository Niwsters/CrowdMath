'use strict';

var mongoose = require('mongoose'),
    
    pageSchema,
    Page

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
      i;
  
  // *******
  // Validation functions for each component type.
  // *******
  
  validations.text = function (component) {
    return true;
  };
  
  validations.math = function (component) {
    return true;
  };
  
  validations.question = function (component) {
    if (!component.content.question) return false;
    if (!component.content.answer) return false;
    
    return true;
  };
  
  validations.youtube = function (component) {
    return true;
  };
  
  validations.autocorrecting = function (component) {
    return true;
  };
  
  // General validation function, for doing the validations 
  // the component types have in common.
  validate = function (component) {
    if (!component.content) return false;
    
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
  }
  
  validations.question = function (path) {
    var i;
    
    if (!path.answers) return false;
    if (path.answers.constructor !== Array) return false;
    
    // Check the question's answers
    for (i=0; i<path.answers.length; i++) {
      if (!path.answers[i].pageID && path.answers[i].pageID !== '') return false;
      if (!path.answers[i].text) return false;
    }
    
    return true;
  }
  
  validate = function (path) {
    if(!path.type) return false;
    
    return validations[path.type](path);
  }
  
  return validate(path);
}, 'Invalid path');

module.exports = Page;