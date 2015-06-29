Book = require('../app/models/book.js');
User = require('../app/models/user.js');

var randomString = function (length) {
  var length = length || 5,
      text = "",
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  
  return text;
}

var factory = {
  User: function (attrs) {
    var user = new User();

    attrs = attrs || {};

    user.email = attrs.email || randomString(6) + '@' + randomString(4) + '.com';
    user.username = attrs.username || randomString(6);
    user.password = user.generateHash(attrs.password || randomString(6));

    return user;
  },
  Book: function (authorID, attrs) {
    var book;

    attrs = attrs || {};

    if (!authorID) {
      throw "Book factory needs an author ID";
    }

    book = new Book();

    book.title = attrs.title || randomString(10);
    book.authors = [authorID];
    book.pages = [
          [
        {
          type: 'text',
          content: '<h1>Blarghity HTML content!</h1>'
            },
        {
          type: 'math',
          content: 'x^2'
            }
          ],
          [
        {
          type: 'math',
          content: 'x^2'
            },
        {
          type: 'text',
          content: '<h2>Honkity honk me heartsies!</h2>'
            }
          ]
        ];

    return book;
  },
  Content: function () {
    return [
      {
        type: 'text',
        content: '<p>New content!</p>'
        },
      {
        type: 'math',
        content: '\intxdx'
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