var factory = require('./factory'),
  helper = require('./helper'),
  initAgent = require('./initAgent'),
  should = require('should'),
  app = require('../server.js'),
  request = require('supertest'),
  assert = require('assert'),
  Book = require('../app/models/book.js'),
  Page = require('../app/models/page.js'),
  mongoose = require('mongoose');

describe('Page model', function () {
  var page,
    i;
  
  beforeEach(function (done) {
    page = factory.Page(mongoose.Types.ObjectId());
    done();
  });

  describe('Paths', function () {
    var properPaths,
        improperPaths,
        testProperPath,
        testImproperPath;

    properPaths = [
      {
        type: 'simple',
        pageID: mongoose.Types.ObjectId()
      },
      {
        type: 'simple',
        pageID: ''
      },
      {
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me",
            pageID: mongoose.Types.ObjectId()
          },
          {
            text: "Don't hurt me",
            pageID: mongoose.Types.ObjectId()
          }
        ]
      },
      {
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me",
            pageID: ''
          }
        ]
      }
    ];
    
    improperPaths = [
      { // Path without type
        pageID: mongoose.Types.ObjectId()
      },
      { // Simple path lacks pageID
        type: 'simple',
      },
      { // Path that lacks type
        text: 'What is love?',
        pageID: mongoose.Types.ObjectId()
      },
      { // Question path that lacks answers
        type: 'question',
        question: 'What is love?'
      },
      { // Question path that lacks question
        type: 'question',
        answers: []
      },
      { // Question path where question is not a string
        type: 'question',
        question: 8,
        answers: []
      },
      { // Question path where answers is not array
        type: 'question',
        answers: 'lolpan'
      },
      { // Question path where an answer lacks PageID
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me"
          },
          {
            text: "Don't hurt me",
            pageID: mongoose.Types.ObjectId()
          }
        ]
      },
      { // Question path where an answer lacks text
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me",
            pageID: mongoose.Types.ObjectId()
          },
          {
            pageID: mongoose.Types.ObjectId()
          }
        ]
      },
      { // Question path answer contains unnecessary property
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me",
            pageID: mongoose.Types.ObjectId(),
            haxorz: 'Unnecesary property'
          }
        ]
      },
      { // Question path contains unnecessary property
        type: 'question',
        question: 'What is love?',
        answers: [
          {
            text: "Baby don't hurt me",
            pageID: mongoose.Types.ObjectId()
          }
        ],
        haxorz: 'Unnecessary property'
      }
    ];
    
    testProperPath = function (path, callback) {
      page.path = path;
      
      page.save(function (err, page) {
        should.not.exist(err);
        page.path.should.eql(path);
        callback();
      });
    };
    
    testImproperPath = function (path, callback) {
      page.path = path;
      
      page.save(function (err, page) {
        should.exist(err);
        callback();
      });
    };
    
    // Automatically test the properly formed paths
    // defined in the array above.
    helper.asyncLoop(properPaths.length, function (loop) {
      var path = properPaths[loop.iteration()];

      it('should save when a proper ' + path.type + ' path is given.', function (done) {
        testProperPath(path, function () {
          done();
        });
      });

      // Apparently Mocha doesn't like it when you put 
      // the .next() thingy in the it()-thingy. Probably 
      // registers all the its before running them.
      // This works, anyways!
      loop.next();
    });
    
    // Automatically test the properly formed paths
    // defined in the array above.
    helper.asyncLoop(improperPaths.length, function (loop) {
      var path = improperPaths[loop.iteration()];

      it('should not save when an improper ' + path.type + ' path is given.', function (done) {
        testImproperPath(path, function () {
          done();
        });
      });

      // Apparently Mocha doesn't like it when you put 
      // the .next() thingy in the it()-thingy. Probably 
      // registers all the its before running them.
      // This works, anyways!
      loop.next();
    });
    
  });

  describe('Components', function () {
    var testProperComponent,
        testImproperComponent,
      properComponents,
      improperComponents;

    // Examples of properly formed components of different types.
    properComponents = [
      {
        type: 'text',
        content: 'Blargh'
      },
      {
        type: 'math',
        content: '\int{2x}dx'
      },
      {
        type: 'question',
        content: {
          question: 'What is love?',
          correctAnswer: "Baby don't hurt me"
        }
      },
      {
        type: 'youtube',
        content: 'zEZGYmtkmSk'
      },
      {
        type: 'autocorrecting',
        content: {
          question: 'What is 2 + 2?',
          correctAnswer: 4
        }
      }
    ];

    improperComponents = [
      { // Component without type
        content: 'lol I have no type'
      },
      { // Text without content
        type: 'text'
      },
      { // Text with object content
        type: 'text',
        content: {}
      },
      { // Text with number content
        type: 'text',
        content: 9105
      },
      { // Math without content
        type: 'math'
      },
      { // Text with object content
        type: 'math',
        content: {}
      },
      { // Text with number content
        type: 'math',
        content: 9105
      },
      { // Question without content
        type: 'question'
      },
      { // Question without question
        type: 'question',
        content: {
          correctAnswer: "Baby don't hurt me"
        }
      },
      { // Question without answer
        type: 'question',
        content: {
          question: 'What is love?'
        }
      },
      { // Question with non-string question
        type: 'question',
        content: {
          question: 8,
          correctAnswer: "Baby don't hurt me"
        }
      },
      { // Question with non-string answer
        type: 'question',
        content: {
          question: 'What is love?',
          correctAnswer: 8
        }
      },
      {
        type: 'question',
        content: {
          question: 'What is love?',
          correctAnswer: "Baby don't hurt me",
          haxorz: 'not allowed property'
        }
      },
      { // YouTube without content
        type: 'youtube'
      },
      { // YouTube with object content
        type: 'youtube',
        content: {}
      },
      { // YouTube with number content
        type: 'youtube',
        content: 9105
      },
      { // Autocorrecting without content
        type: 'autocorrecting'
      },
      { // Autocorrecting without question
        type: 'autocorrecting',
        content: {
          answer: 4
        }
      },
      { // Autocorrecting without answer
        type: 'autocorrecting',
        content: {
          question: 'What is 2 + 2?'
        }
      },
      { // Autocorrecting with unnecessary content property
        type: 'autocorrecting',
        content: {
          question: 'What is 2 + 2?',
          answer: 4,
          haxorz: 'not allowed property'
        }
      },
      { // Autocorrecting with non-string question
        type: 'autocorrecting',
        content: {
          question: 4,
          answer: 4,
        }
      },
      { // Autocorrecting with non-number answer
        type: 'autocorrecting',
        content: {
          question: 'What is 2 + 2?',
          answer: 'lolpan'
        }
      },
      { // Text with unnecessary property
        type: 'text',
        content: 'Blargh',
        haxorz: 'not allowed property'
      }
    ];

    testProperComponent = function (component, callback) {
      page.components.push(component);

      page.save(function (err, page) {
        should.not.exist(err);
        page.components.should.containEql(component);
        callback();
      });
    };

    testImproperComponent = function (component, callback) {
      page.components.push(component);

      page.save(function (err, page) {
        should.exist(err);
        callback();
      });
    };

    // Automatically test the properly formed components 
    // defined in the array above.
    helper.asyncLoop(properComponents.length, function (loop) {
      var component = properComponents[loop.iteration()];

      it('should save when a proper ' + component.type + ' component is given.', function (done) {
        testProperComponent(component, function () {
          done();
        });
      });

      // Apparently Mocha doesn't like it when you put 
      // the .next() thingy in the it()-thingy. Probably 
      // registers all the its before running them.
      // This works, anyways!
      loop.next();
    });

    // Automatically test the improperly formed components 
    // defined in the array above.
    helper.asyncLoop(improperComponents.length, function (loop) {
      var component = improperComponents[loop.iteration()],
          componentType;
      
      // In case component.type is not defined, set it as unknown type 
      // WITHOUT affecting the component object.
      componentType = component.type || '(unknown type)';

      it('should not save when an improper ' + componentType + ' component is given.', function (done) {
        testImproperComponent(component, function () {
          done();
        });
      });

      // Apparently Mocha doesn't like it when you put 
      // the .next() thingy in the it()-thingy. Probably 
      // registers all the its before running them.
      // This works, anyways!
      loop.next();
    });
  });
});
