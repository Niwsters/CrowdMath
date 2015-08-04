var factory = require('./factory'),
  initAgent = require('./initAgent'),
  should = require('should'),
  app = require('../server.js'),
  request = require('supertest'),
  assert = require('assert');

describe('/book', function () {

  describe('public', function () {

    describe('GET', function () {
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

      it('should return the book with given ID', function (done) {
        request(app)
          .get('/book')
          .query({
            id: book._id
          })
          .end(function (err, res) {
            res.body.title.should.equal(book.title);
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

      it('should have isUserAuthor attribute that returns false when not logged in', function (done) {
        request(app)
          .get('/book')
          .query({
            id: book.id
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.body.isUserAuthor.should.equal(false);
            done();
          });
      });

      it('should return error if book not found', function (done) {
        request(app)
          .get('/book')
          .query({
            title: 'Title that does not exist'
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.status.should.equal(500);
            res.text.should.equal('Error retrieving book: Book not found.');
            done();
          });
      });
    });
  });

  describe('logged in', function () {
    var user;

    before(function (done) {
      initAgent(done);
    });

    before(function (done) {
      user = factory.User();
      user.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    describe('GET', function () {

      it('should have isUserAuthor attribute that is true if logged in user is author', function (done) {
        var book = factory.Book(agent.user._id);

        book.save(function (err) {
          should.not.exist(err);

          agent
            .get('/book')
            .query({
              id: book.id
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.body.isUserAuthor.should.equal(true);
              done();
            });
        });

      });

      it('should have isUserAuthor attribute that is false if logged in user is not author', function (done) {
        var book = factory.Book(user._id);

        book.save(function (err) {
          should.not.exist(err);

          agent
            .get('/book')
            .query({
              id: book.id
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.body.isUserAuthor.should.equal(false);
              done();
            });
        });
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
            res.error.text.should.equal("Error creating book: No title given.");
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
              res.status.should.equal(500);
              res.text.should.equal("Error creating book: Title already taken.");
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

      it('should throw error if logged in user is not author of the book', function (done) {
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
              res.status.should.equal(500);

              Book.findById(book.id, function (err, b) {
                should.not.exist(err);

                b.title.should.not.equal(newTitle);

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

            res.status.should.equal(500);

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

            res.status.should.equal(500);

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
            res.text.should.equal("Successfully deleted book.");

            Book.findById(book.id, function (err, b) {
              should.not.exist(b);
              done();
            });
          });
      });

      it('should return error if user is not author of book', function (done) {
        book.authors = [user.id];
        book.save(function (err, book) {
          should.not.exist(err);
          agent
            .delete('/book')
            .query({
              id: book.id
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error deleting book: User not author.");
              done();
            });
        })
      });

      it('should throw 500 error when not given ID', function (done) {
        agent
          .delete('/book')
          .end(function (err, res) {
            should.not.exist(err);

            res.error.text.should.equal("Error deleting book: No book ID given.");
            res.error.status.should.equal(500);
            done();
          })
      });

    });
  });
});
