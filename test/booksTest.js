var factory = require('./factory'),
    initAgent = require('./initAgent'),
    should = require('should'),
    app = require('../server.js'),
    request = require('supertest'),
    Book = require('../app/models/book.js'),
    assert = require('assert');

describe('/books', function () {
  describe('public', function () {
    var book, book2, user, user2;

    beforeEach(function (done) {
      factory.CreateUserWithBook(function (models) {
        book = models.book;
        user = models.user;
        
        res = factory.CreateUserWithBook(function (models) {
          book2 = models.book;
          user2 = models.user;
          
          done();
        })
      });
    });

    it('should return all books if ID or author ID not given', function (done) {
      request(app)
        .get('/books')
        .end(function (err, res) {
          res.body.should.containModel(book);
          res.body.should.containModel(book2);
          
          done();
        });
    });

    it('should return books with given author ID', function (done) {
      request(app)
        .get('/books')
        .query({
          ownerID: user.id
        })
        .end(function (err, res) {
          res.body.should.containModel(book);
          res.body.should.not.containModel(book2);
          done();
        });
    });

  });
});
