var factory = require('./factory'),
  initAgent = require('./initAgent'),
  should = require('should'),
  app = require('../server.js'),
  request = require('supertest'),
  assert = require('assert');

describe('/book', function () {

  describe('public', function () {

    describe('GET', function () {
      var book, user;

      beforeEach(function (done) {
        user = factory.User();
        user.save(function (err) {
          should.not.exist(err);
          book = factory.Book(user.id);
          book.save(function (err) {
            should.not.exist(err);
            done();
          });
        });
      });

      it('should return the book with given ID', function (done) {
        request(app)
          .get('/book')
          .query({
            id: book.id
          })
          .end(function (err, res) {
            res.body.title.should.equal(book.title);
            done();
          });
      });

      it('should return books with given author ID', function (done) {
        request(app)
          .get('/book')
          .query({
            authorID: user.id
          })
          .end(function (err, res) {
            res.body[0].title.should.equal(book.title);
            done();
          });
      });

      it('should return all books if ID or author ID not given', function (done) {
        request(app)
          .get('/book')
          .end(function (err, res) {
            res.body[0].title.should.equal(book.title);
            done();
          });
      });

      it('should return the book with given title', function (done) {
        request(app)
          .get('/book')
          .query({
            title: book.title
          })
          .end(function (err, res) {
            res.body.title.should.equal(book.title);
            done();
          });
      });
    });
  });

  describe('logged in', function () {

    before(function (done) {
      initAgent(done);
    });
    var user;

    before(function (done) {
      user = factory.User();
      user.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    describe('POST', function () {

      it('should create a new book with given title', function (done) {
        var title = "Bookie";

        agent
          .post('/book')
          .send({
            title: title
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.body.title.should.equal(title);
            done();
          });
      });

      it('should throw 500 error when not given title', function (done) {

        agent
          .post('/book')
          .end(function (err, res) {
            should.not.exist(err);
            res.error.text.should.equal("Error creating book: No title given");
            res.error.status.should.equal(500);
            done();
          });
      });

      it('should throw 500 error when book title is already taken', function (done) {
        var book = factory.Book(user.id);
        book.save(function (err) {
          should.not.exist(err);

          agent
            .post('/book')
            .send({
              title: book.title
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.error.text.should.equal("Error creating book: Title already taken");
              res.error.status.should.equal(500);
              done();
            });
        });

      })
    });

    describe('PUT', function () {
      var book, user2;

      beforeEach(function (done) {
        book = factory.Book(agent.user.id);
        book.save(function (err) {
          should.not.exist(err);

          user2 = factory.User({
            username: "Tester 2",
            email: "tester2@test.com"
          });
          user2.save(function (err) {
            should.not.exist(err);
            done()
          })
        });
      });

      it('should update book when given ID and new book attributes', function (done) {
        var newTitle = "New title",
          newContent = "New content",
          newAuthors = [book.authors[0], user2.id];

        agent
          .put('/book')
          .send({
            id: book.id,
            newAttrs: {
              title: newTitle,
              authors: newAuthors
            }
          })
          .end(function (err, res) {
            should.not.exist(err);

            res.body.title.should.equal(newTitle);
            res.body.authors.length.should.equal(2);

            done();
          });
      });

      it('should not update book if logged in user is not author of the book', function (done) {
        book.authors = [user2.id];
        book.save(function (err) {
          var newTitle = "A different title";

          should.not.exist(err);

          agent
            .put('/book')
            .send({
              id: book.id,
              newAttrs: {
                title: newTitle
              }
            })
            .end(function (err, res) {
              should.not.exist(err);

              Book.findById(book.id, function (err, b) {
                should.not.exist(err);

                b.title.should.not.equal(newTitle);
                res.text.should.equal("Error updating book: User not author");

                done();
              });
            });
        });
      });

      it('should return 500 error if ID not given', function (done) {
        agent
          .put('/book')
          .send({
            newAttrs: {
              title: "Blarghity"
            }
          })
          .end(function (err, res) {
            should.not.exist(err);

            res.error.status.should.equal(500);
            res.error.text.should.equal("Error updating book: ID not given");

            done();
          });
      });

      it('should return 500 error if newAttrs not given', function (done) {
        agent
          .put('/book')
          .send({
            id: book.id
          })
          .end(function (err, res) {
            should.not.exist(err);

            res.error.status.should.equal(500);
            res.error.text.should.equal("Error updating book: newAttrs not given");

            done();
          })
      })

    });

    describe('DELETE', function () {
      var book;

      beforeEach(function (done) {
        book = factory.Book(agent.user.id);
        book.save(function (err) {
          should.not.exist(err);
          done();
        });
      });

      it('should delete book with given ID', function (done) {
        agent
          .delete('/book')
          .query({
            id: book.id
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.text.should.equal("Successfully removed book");

            Book.findById(book.id, function (err, b) {
              should.not.exist(b);
              done();
            });
          });
      });

      it('should throw 500 error when not given ID', function (done) {
        agent
          .delete('/book')
          .end(function (err, res) {
            should.not.exist(err);

            res.error.text.should.equal("Error deleting book: No book ID given");
            res.error.status.should.equal(500);
            done();
          })
      });

    });
  });
});