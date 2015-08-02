var factory = require('./factory'),
    initAgent = require('./initAgent'),
    should = require('should'),
    app = require('../server.js'),
    request = require('supertest'),
    assert = require('assert');

describe('/books', function () {
  describe('public', function () {
    var book, book2, user, user2;

    beforeEach(function (done) {
      user = factory.User();
      user.save(function (err) {
        should.not.exist(err);
        book = factory.Book(user.id);
        book.save(function (err, dbBook) {
          should.not.exist(err);

          user2 = factory.User();
          user2.save(function (err) {
            should.not.exist(err);

            book2 = factory.Book(user2.id);
            book2.save(function (err, dbBook) {
              should.not.exist(err);

              // Fixes annoying issue with comparing the _id attribute
              book = book.toObject();
              book._id = book._id.toString();
              book2 = book2.toObject();
              book2._id = book2._id.toString();

              done();
            });
          });
        });
      });
    });

    it('should return all books if ID or author ID not given', function (done) {
      request(app)
        .get('/books')
        .end(function (err, res) {
          res.body.should.containEql(book);
          res.body.should.containEql(book2);
          
          done();
        });
    });

    it('should return books with given author ID', function (done) {
      request(app)
        .get('/books')
        .query({
          authorID: user.id
        })
        .end(function (err, res) {
          res.body.should.containEql(book);
          res.body.should.not.containEql(book2);
          done();
        });
    });

  });
});
