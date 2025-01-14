/* jshint -W079 */

var User = require('../app/models/user'),
  Book = require('../app/models/book'),
  Page = require('../app/models/page'),
  _ = require('underscore');

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function (req, res) {
    res.render('login.ejs', {
      message: req.flash('loginMessage')
    });
  });

  app.get('/signup', function (req, res) {
    //res.render('signup-disabled.ejs');

    
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
    
  });

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/app', function (req, res) {
    res.render('frontend.ejs', {
      user: req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/app',
    failureRedirect: '/signup',
    failureFlash: true // allow flash messages
  }));

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/app#/',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // retrieve user
  app.get('/user', function (req, res) {

    if (req.query.id) {
      User.findById(req.query.id, function (err, user) {
        if (err) throw err;

        res.json(user);
      });
    } else {
      res.json(req.user);
    }

  });

  app.get('/book', function (req, res, next) {
    var q = {};

    if (req.query.id) q._id = req.query.id;
    if (req.query.title) q.title = req.query.title;

    Book.findOne(q, function (err, book) {
      if (err) return next(err);

      // Return error if book not found
      if (!book) return next("Error retrieving book: Book not found.");

      // Set isUserAuthor to true if logged in user is author or owner of the book
      book.isUserAuthor = false;
      if (req.user &&
        (book.owner.equals(req.user.id) || book.authors.indexOf(req.user.id) > -1)) {
        book.isUserAuthor = true;
      }

      res.json(book);
    });
  });

  app.post('/book', isLoggedIn, function (req, res, next) {
    var book = new Book();

    if (!req.body.title) throw "Error creating book: No title given.";

    book.title = req.body.title;
    book.owner = req.user.id;
    book.pages = [];
    
    if (req.body.dynamic !== undefined) book.dynamic = req.body.dynamic;

    // Check if book with given title already exists (for error checking reasons).
    Book.findOne({
      title: book.title
    }, function (err, b) {
      if (err) return next(err);

      // Return error if title already taken.
      if (b) return next("Error creating book: Title already taken.");

      book.save(function (err) {
        if (err) return next(err);

        res.json(book);
      });
    });
  });

  app.put('/book', isLoggedIn, function (req, res, next) {
    var id = req.body.id,
      newAttrs = req.body.newAttrs;

    if (!id) next("Error updating book: ID not given.");
    if (!newAttrs) next("Error updating book: Attributes not given.");

    Book.findById(id, function (err, book) {
      var attr;

      if (err)
        return next(err);

      // If book not found
      if (!book)
        return next("Error updating book: Book not found with given ID");

      // If user is not owner nor author of book
      if (!book.owner.equals(req.user.id) &&
        book.authors.indexOf(req.user.id) === -1)
        return next("Error updating book: User not author");

      for (attr in newAttrs) {
        if (newAttrs.hasOwnProperty(attr)) {
          book[attr] = newAttrs[attr];
        }
      }

      book.save(function (err, book) {
        if (err) return next(err);

        res.json(book);
      });
    });
  });

  app.delete('/book', isLoggedIn, function (req, res, next) {
    var id = req.query.id;

    if (!id) return next("Error deleting book: No book ID given.");

    Book.findById(id, function (err, book) {

      // If user is not owner or author
      if (!book.owner.equals(req.user.id) && book.authors.indexOf(req.user.id) === -1)
        return next("Error deleting book: User not author.");

      book.remove(function (err) {
        if (err) return next(err);
        res.send("Successfully deleted book.");
      });

    });
  });

  app.get('/books', function (req, res) {
    var q = {};

    if (req.query.ownerID) q.owner = req.query.ownerID;

    Book.find(q, function (err, books) {
      if (err) throw err;
      res.json(books);
    });
  });

  app.get('/page', function (req, res, next) {

    // If pageID is given, get page by ID as usual
    if (req.query.pageID) {
      Page
      .findById(req.query.pageID)
      .populate('book')
      .exec(function (err, page) {
        if (err) return next(err);
        if (!page) return next("Error retrieving page: Page not found.");
        
        res.json(page);
      });

    // If book title and page number are given instead, get
    // the page through its book. (should refactor the Page model 
    // so it contains the book's title as well)
    } else if (req.query.bookTitle && req.query.pageNumber) {
      if (req.query.pageNumber < 0) return next("Error retrieving page: Page number less than zero.");

      Book.findOne({ title: req.query.bookTitle }, function (err, book) {
        var pageID;
        if (err) return next(err);
        if (!book) return next("Error retrieving page: Book with given title not found.");
        if (book.pages.length < req.query.pageNumber) return next("Error retrieving page: Page with given page number not found.");

        pageID = book.pages[req.query.pageNumber - 1].id;

        Page
        .findById(pageID)
        .populate('book')
        .exec(function (err, page) {
          res.json(page);
        });
      });
    } else {
      return next("Error retrieving page: Need either page ID or book title + page number.");
    }
});

  app.post('/page', isLoggedIn, function (req, res, next) {

    if (!req.body.bookID) return next("Error creating page: Book ID not given.");

    Book.findById(req.body.bookID, function (err, book) {
      var page;

      if (!book) return next("Error creating page: Book not found with given ID.");
      if (!book.owner.equals(req.user.id) && book.authors.indexOf(req.user.id) === -1) {
        return next("Error creating page: User not author of book.");
      }

      page = new Page();
      page.book = book.id;
      
      // Create a path for the page if its book is dynamic
      if (book.dynamic === true) {
        page.path = {
          type: 'simple',
          pageID: ''
        };
      }

      // Set the page's title to for example "Page 2" if it's the 
      // second page in the book.
      page.title = "Page " + (book.pages.length + 1).toString();

      // Add reference to page's ID and title in the book
      book.pages.push({
        id: page.id,
        title: page.title
      });
      
      page.save(function (err, page) {
        if(err) return next(err);
        
        book.save(function (err, book) {
          if(err) return next(err);
          
          res.json(page);
        });
      });
    });

  });

  app.delete('/page', isLoggedIn, function (req, res, next) {
    if (!req.query.pageID) return next("Error deleting page: Page ID not given.");

    Page.findById(req.query.pageID, function (err, page) {
      if (err) return next(err);
      if (!page) return next("Error deleting page: Page not found with given ID.");

      Book.findById(page.book, function (err, book) {
        var pageIndex;
        
        if (err) return next(err);

        // Remove page reference in book
        pageIndex = _.findIndex(book.pages, function (pageRef) {
          return pageRef.id.toString() === page.id;
        });
        book.pages.splice(pageIndex, 1);
        
        // Update book
        book.save(function (err) {
          if (err) return next(err);

          // Remove page
          page.remove(function (err) {
            if (err) return next(err);

            res.send("Successfully deleted page.");
          });
        });
      });
    });
  });

  app.put('/page', isLoggedIn, function (req, res, next) {
    if (!req.body._id) return next("Error updating page: Page ID not given.");

    Page.findById(req.body._id, function (err, page) {
      if (err) return next(err);
      if (!page) return next("Error updating page: Page not found.");

      Book.findById(page.book, function (err, book) {
        if (err) return next(err);

        // Return error if user is not author the page's book.
        if (!book.owner.equals(req.user.id) && book.authors.indexOf(req.user.id) === -1) {
          return next("Error updating page: User not author.");
        }

        // Update the page's properties
        page.title = req.body.title;
        page.components = req.body.components;
        page.path = req.body.path;

        // Save changes.
        page.save(function (err, page) {
          if (err) return next(err);

          res.json(page);
        });
      });
    });
  });
};

var isLoggedIn = function (req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if not redirect them to the home page
  res.redirect('/');
};
