var factory = require('./factory'),
  initAgent = require('./initAgent'),
  should = require('should'),
  app = require('../server.js'),
  request = require('supertest'),
  assert = require('assert'),
  Book = require('../app/models/book.js');

describe('/book/page', function () {
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

  describe('GET', function () {

    it('should return page and pagecount when given book and number', function (done) {
      var pageNumber = 1;
      request(app)
        .get('/book/page')
        .query({
          bookTitle: book.title,
          pageNumber: pageNumber
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.body.page.should.eql(book.pages[pageNumber - 1]);
          res.body.pageCount.should.equal(book.pages.length);
          done();
        });
    });

    it('should return error when not given book title', function (done) {
      var pageNumber = 1;
      request(app)
        .get('/book/page')
        .query({
          pageNumber: pageNumber
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.equal("Error retrieving page: Book title not given.");
          done();
        });
    });

    it('should return error when not given page number', function (done) {
      request(app)
        .get('/book/page')
        .query({
          bookTitle: book.title
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.equal("Error retrieving page: Page number not given.");
          done();
        });
    });

  });

  describe('logged in', function () {

    before(function (done) {
      initAgent(done);
    });

    describe('POST', function () {

      describe('User is author', function () {
        beforeEach(function (done) {
          book.authors.push(agent.user._id);
          book.save(function (err) {
            should.not.exist(err);
            done();
          });
        });

        it('should create new empty page at the end of book with given book title', function (done) {
          var expectedPageCount = book.pages.length + 1,
            expectedPage = [];

          agent
            .post('/book/page')
            .send({
              bookTitle: book.title
            })
            .end(function (err, res) {
              should.not.exist(err);
              Book.findOne({
                title: book.title
              }, function (err, book) {
                should.not.exist(err);
                book.pages.length.should.equal(expectedPageCount);
                book.pages[expectedPageCount - 1].should.eql(expectedPage);
                done();
              });
            });
        });

        it('should return error if book title not given', function (done) {
          var expectedPageCount = book.pages.length;

          agent
            .post('/book/page')
            .send({})
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error creating page: Book title not given.");
              Book.findOne({
                title: book.title
              }, function (err, book) {
                should.not.exist(err);
                book.pages.length.should.equal(expectedPageCount);
                done();
              });
            });
        });
      });

      it('should not create new page if user is not author', function (done) {
        var expectedPageCount = book.pages.length;

        agent
          .post('/book/page')
          .send({
            bookTitle: book.title
          })
          .end(function (err, res) {
            res.text.should.equal("Error creating page: User not author of book");

            Book.findOne({
              title: book.title
            }, function (err, book) {
              should.not.exist(err);
              book.pages.length.should.equal(expectedPageCount);
              done();
            });
          });
      });
    });

    describe('DELETE', function () {

      describe('User is author', function () {
        beforeEach(function (done) {
          book.authors.push(agent.user._id);
          book.save(function (err, book) {
            should.not.exist(err);
            done();
          });
        });

        it('should delete page given book title and page number', function (done) {
          var expectedPageCount;

          book.pages.push("Blarghity");
          expectedPageCount = book.pages.length - 1;
          book.save(function (err, book) {
            agent
              .delete('/book/page')
              .query({
                bookTitle: book.title,
                pageNumber: book.pages.length
              })
              .end(function (err, res) {
                should.not.exist(err);
                Book.findOne({
                  title: book.title
                }, function (err, book) {
                  should.not.exist(err);
                  book.pages.length.should.equal(expectedPageCount);
                  done();
                });
              });
          });
        });

        it('should return error if book title is not given', function (done) {
          var expectedPageCount = book.pages.length;

          agent
            .delete('/book/page')
            .query({
              pageNumber: book.pages.length
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error deleting page: Book title not given.");

              Book.findOne({
                title: book.title
              }, function (err, book) {
                should.not.exist(err);
                book.pages.length.should.equal(expectedPageCount);
                done();
              });
            });
        });

        it('should return error if page number is not given', function (done) {
          var expectedPageCount = book.pages.length;

          agent
            .delete('/book/page')
            .query({
              bookTitle: book.title
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error deleting page: Page number not given.");

              Book.findOne({
                title: book.title
              }, function (err, book) {
                should.not.exist(err);
                book.pages.length.should.equal(expectedPageCount);
                done();
              })
            });
        });
      });

      it('should not delete page if user is not author', function (done) {
        var expectedPageCount;

        book.pages.push("Blarghity");
        expectedPageCount = book.pages.length;
        book.save(function (err, book) {
          agent
            .delete('/book/page')
            .query({
              bookTitle: book.title,
              pageNumber: book.pages.length
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error deleting page: User not author of book.");
              Book.findOne({
                title: book.title
              }, function (err, book) {
                should.not.exist(err);
                book.pages.length.should.equal(expectedPageCount);
                done();
              });
            });
        });
      });

    });

    describe('PUT', function () {

      describe('User is author', function () {
        beforeEach(function (done) {
          book.authors.push(agent.user._id);
          book.save(function (err, book) {
            should.not.exist(err);
            done();
          });
        });
        
        it('should update page given book title, page number and content', function (done) {
          var pageNumber = book.pages.length,
            content = factory.Content();
          
          agent
            .put('/book/page')
            .send({
              bookTitle: book.title,
              pageNumber: pageNumber,
              content: content
            })
            .end(function (err, res) {
              should.not.exist(err);
              Book.findOne({
                title: book.title
              }, function (err, book) {
                book.pages[pageNumber - 1].should.eql(content);
                done();
              });
            });
        });

        it('should return error if given content is not an array', function (done) {
          var pageNumber = book.pages.length,
              content = 'Blargh honk';
          
          agent
          .put('/book/page')
          .send({
            bookTitle: book.title,
            pageNumber: pageNumber,
            content: content
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.text.should.equal("Error updating page: Given content is not an array.");
            done();
          });
        });
        
        it('should return error if given content does not ONLY contain type and content', function (done) {
          var pageNumber = book.pages.length,
              content = [
                {
                  type: 'text',
                  honk: 'Blargh'
                }
              ];
          
          agent
          .put('/book/page')
          .send({
            bookTitle: book.title,
            pageNumber: pageNumber,
            content: content
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.text.should.equal("Error updating page: Given content is not on the correct form.");
            done();
          });
        });

        it('should return error if book title not given', function (done) {
          var pageNumber = book.pages.length,
            content = {
              type: 'text',
              content: 'New content'
            };

          agent
            .put('/book/page')
            .send({
              pageNumber: pageNumber,
              content: content
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error updating page: Book title not given.");
              done();
            });
        });

        it('should return error if page number not given', function (done) {
          var content = 'New content';

          agent
            .put('/book/page')
            .send({
              bookTitle: book.title,
              content: content
            })
            .end(function (err, res) {
              should.not.exist(err);
              res.text.should.equal("Error updating page: Page number not given.");
              done();
            });
        });
      });

      it('should not update page if user is not author', function (done) {
        var pageNumber = book.pages.length,
          originalContent = book.pages[pageNumber - 1];
        content = factory.Content();

        agent
          .put('/book/page')
          .send({
            bookTitle: book.title,
            pageNumber: pageNumber,
            content: content
          })
          .end(function (err, res) {
            should.not.exist(err);
            res.text.should.equal("Error updating page: User not author of book.");
            Book.findOne({
              title: book.title
            }, function (err, book) {
              book.pages[pageNumber - 1].should.eql(originalContent);
              done();
            });
          });
      });

    });
  });
});