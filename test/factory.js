var Book = require('../app/models/book.js'),
  User = require('../app/models/user.js'),
  Page = require('../app/models/page.js'),
  should = require('should'),
  randomString,
  saveAll,
  modelToObject;

randomString = function (length) {
  var length = length || 5,
    text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

saveAll = function (models, callback) {
  var doneCount = 0,
    i,
    finish,
    modelCount = Object.keys(models).length,
    res = {},
    saveModel;

  // Up the doneCount and check if all models are saved.
  finish = function () {
    doneCount++;

    // When all given models are saved, call the callback.
    if (doneCount === modelCount) {
      callback(res);
    }
  };

  // This is needed to call an async function in a for loop.
  saveModel = function (prop) {
    var model = prop;

    models[model].save(function (err, m) {
      should.not.exist(err);

      res[model] = m;

      finish();
    });
  };

  for (var prop in models) {
    if (models.hasOwnProperty(prop)) {
      saveModel(prop);
    }
  }
};

var factory = {
  User: function (attrs) {
    var user = new User();

    attrs = attrs || {};

    user.email = attrs.email || randomString(6) + '@' + randomString(4) + '.com';
    user.username = attrs.username || randomString(6);
    user.password = user.generateHash(attrs.password || randomString(6));
    user.books = attrs.books || [];

    return user;
  },
  Book: function (ownerID, attrs) {
    var book;

    attrs = attrs || {};

    if (!ownerID) throw "Book factory needs an owner ID";

    book = new Book();

    book.title = attrs.title || randomString(10);
    book.owner = ownerID;
    book.authors = [];
    book.pages = [];

    return book;
  },
  Page: function (bookID, attrs) {
    var page;
    
    if (!bookID) throw "The page constructor needs a book ID";

    attrs = attrs || {};

    page = new Page();
    
    page.bookID = bookID;
    
    page.components = attrs.components || [];

    if (attrs.paths) {
      page.paths = attrs.paths || [];
      page.defaultPathIndex = attrs.defaultPathIndex || 0;
    }

    return page;
  },
  CreateUserWithBook: function (callback) {
    // Create user
    user = factory.User();

    // Create book and attach it to the user
    book = factory.Book(user.id);
    user.books = [book.id];

    // Create pages and attach it to the book
    page = factory.Page(book.id);
    page2 = factory.Page(book.id);
    book.pages = [page.id, page2.id];

    // Save everything
    saveAll({
      page: page,
      page2: page2,
      book: book,
      user: user
    }, callback);
  },
  Components: function () {
    return [
      {
        type: 'text',
        content: '<p>New content!</p>'
      },
      {
        type: 'math',
        content: '\intxdx'
      },
      {
        type: 'question',
        content: {
          question: 'What is love?',
          answer: "Baby don't hurt me"
        }
      },
      {
        type: 'autocorrecting',
        content: {
          question: 'What is 2 + 2?',
          answer: 4
        }
      },
      {
        type: 'youtube',
        content: 'zEZGYmtkmSk'
      }
    ];
  },
  questionComponent: function () {
    return [
      {
        type: 'question',
        content: {
          question: 'What is love?',
          answer: "Baby don't hurt me"
        }
      }
    ];
  }
};




module.exports = factory;
