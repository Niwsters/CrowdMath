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

describe('/page', function () {
  var book, user, page, page2;

  beforeEach(function (done) {
    factory.CreateUserWithBook(function (models) {
      book = models.book;
      user = models.user;
      page = models.page;
      page2 = models.page2;

      done();
    });
  });

  describe('GET', function () {

    it('should return page given page ID', function (done) {
      request(app)
        .get('/page')
        .query({
          pageID: page.id
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.body.should.eqlModel(page);
          done();
        });
    });

    it('should return error if page not found', function (done) {
      request(app)
        .get('/page')
        .query({
          pageID: 'id that does not exist'
        })
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.equal(500);
          res.text.should.equal("Error retrieving page: Page not found.");
          done();
        });
    });

    it('should return error if page ID not given', function (done) {
      request(app)
        .get('/page')
        .query()
        .end(function (err, res) {
          should.not.exist(err);
          res.status.should.equal(500);
          res.text.should.equal("Error retrieving page: Page ID not given.");
          done();
        });
    });

  });

  describe('logged in', function () {

    before(function (done) {
      initAgent(done);
    });

    describe('POST', function () {

      it('should return error if user is not author of book', function (done) {
        agent
          .post('/page')
          .send({
            bookID: book.id
          })
          .end(function (err, res) {
            should.not.exist(err);

            res.status.should.equal(500);
            res.text.should.equal("Error creating page: User not author of book.");
            done();
          });
      });

      describe('User is author', function () {
        beforeEach(function (done) {
          book.owner = agent.user._id;
          book.save(function (err) {
            should.not.exist(err);
            done();
          });
        });

        it('should create new empty page at the end of book with given book ID', function (done) {
          var expectedPageCount = book.pages.length + 1;

          agent
            .post('/page')
            .send({
              bookID: book.id
            })
            .end(function (err, res) {
              should.not.exist(err);

              // Look up the book and check if the page was created
              Book.findById(book.id, function (err, book) {
                should.not.exist(err);
                
                book.pages.length.should.equal(expectedPageCount);
                
                Page.findById(res.body._id, function (err, page) {
                  should.exist(page);
                  
                  // Page's default title should be something like "Page 2" depending 
                  // on how many pages the book has.
                  page.title.should.equal("Page " + book.pages.length.toString());
                  
                  page.bookID.equals(book.id).should.equal(true);
                  page.components.toObject().should.eql([]);
                  
                  // Make sure the book's page reference contains the right ID and title
                  book.pages[book.pages.length - 1].id.equals(page.id).should.equal(true);
                  book.pages[book.pages.length - 1].title.should.equal(page.title);
                  
                  done();
                });
              });
            });
        });
        
        it('should create empty page with default path if book is dynamic', function (done) {
          var expectedPathObject = factory.DefaultPath();
          
          book.dynamic = true;
          book.save(function (err, book) {
            agent
            .post('/page')
            .send({
              bookID: book.id
            })
            .end(function (err, res) {
              should.not.exist(err);
              
              res.body.path.should.eql(expectedPathObject);
              done();
            });
          });
        });

        it('should return error if bookID not given', function (done) {
          agent
            .post('/page')
            .end(function (err, res) {
              should.not.exist(err);

              res.status.should.equal(500);
              res.text.should.equal("Error creating page: Book ID not given.");

              done();
            });
        });

        it('should return error if book not found with ID', function (done) {
          agent
            .post('/page')
            .send({
              bookID: 'id that does not exist'
            })
            .end(function (err, res) {
              should.not.exist(err);

              res.status.should.equal(500);
              res.text.should.equal("Error creating page: Book not found with given ID.");

              done();
            });
        });

      });
    });

    describe('DELETE', function () {

      describe('User is author', function () {
        beforeEach(function (done) {
          book.owner = agent.user._id;
          book.save(function (err, book) {
            should.not.exist(err);
            done();
          });
        });

        it('should delete page given page ID', function (done) {
          var expectedPageCount = book.pages.length - 1;

          agent
            .delete('/page')
            .query({
              pageID: page.id
            })
            .end(function (err, res) {
              should.not.exist(err);

              res.text.should.equal("Successfully deleted page.");

              Book.findById(book.id, function (err, book) {
                book.pages.should.not.containEql(page.id);
                book.pages.length.should.equal(expectedPageCount);

                done();
              });
            });
        });

        it('should return error if page ID not given', function (done) {
          agent
            .delete('/page')
            .query({
            })
            .end(function (err, res) {
              should.not.exist(err);

              res.status.should.equal(500);
              res.text.should.equal("Error deleting page: Page ID not given.");

              done();
            });
        });

        it('should return error if page not found', function (done) {
          agent
            .delete('/page')
            .query({
              pageID: mongoose.Types.ObjectId().toString()
            })
            .end(function (err, res) {
              should.not.exist(err);

              res.status.should.equal(500);
              res.text.should.equal("Error deleting page: Page not found with given ID.");

              done();
            });
        });
      });

    });

    describe('PUT', function () {
      
      it('should not update page if user is not author', function (done) {
        var components = factory.Components();
        
        page.components = components;

        agent
          .put('/page')
          .send(page)
          .end(function (err, res) {
          should.not.exist(err);

          res.status.should.equal(500);
          res.text.should.equal("Error updating page: User not author.");

          Page.findById(page.id, function (err, page) {
            page.components.toObject().should.not.eql(components);

            done();
          });
        });
      });

      describe('User is author', function () {
        beforeEach(function (done) {
          book.authors.push(agent.user._id);
          book.save(function (err, book) {
            should.not.exist(err);
            done();
          });
        });

        afterEach(function (done) {
          // Empty the book
          Book.findOne({
            title: book.title
          }, function (err, book) {
            should.not.exist(err);
            book.pages = [];
            book.save(function (err, book) {
              should.not.exist(err);
              done();
            })
          })
        });

        it('should update page components and path', function (done) {
          page.title = factory.RandomString(10);
          page.components = factory.Components();
          page.path = factory.Path();

          agent
            .put('/page')
            .send(page)
            .end(function (err, res) {
              should.not.exist(err);

              Page.findById(page.id, function (err, dbPage) {
                dbPage.title.should.equal(page.title);
                dbPage.components.toObject().should.eql(page.components.toObject());
                dbPage.path.should.eql(page.path);

                done();
              });
            });
        });

        it('should return error if pageID not given', function (done) {
          page.components = factory.Components();
          page._id = undefined;

          agent
            .put('/page')
            .send(page)
            .end(function (err, res) {
              should.not.exist(err);

              res.status.should.equal(500);
              res.text.should.equal("Error updating page: Page ID not given.");

              done();
            });
        });
        
        it('should return error if page not found', function (done) {
          page.components = factory.Components();
          page._id = mongoose.Types.ObjectId().toString();
          
          agent
          .put('/page')
          .send(page)
          .end(function (err, res) {
            should.not.exist(err);
            
            res.status.should.equal(500);
            res.text.should.equal("Error updating page: Page not found.");
            
            done();
          });
        });
      });

    });
  });
});
