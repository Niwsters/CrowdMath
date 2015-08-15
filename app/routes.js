var User = require('../app/models/user'),
  Book = require('../app/models/book'),
  Page = require('../app/models/page'),
  isContentCorrectForm;

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
    res.render('signup-disabled.ejs');

    /*
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    });
    */
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
    })
  });

  app.post('/book', isLoggedIn, function (req, res, next) {
    var book = new Book();

    if (!req.body.title) throw "Error creating book: No title given.";

    book.title = req.body.title;
    book.owner = req.user.id;
    book.pages = [];

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

    if (!req.query.pageID) return next("Error retrieving page: Page ID not given.");

    Page.findById(req.query.pageID, function (err, page) {
      if (!page) return next("Error retrieving page: Page not found.");

      res.json(page);
    });
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
      page.bookID = book.id;

      book.pages.push(page.id);
      book.save(function (err, book) {
        if (err) return next(err);

        page.save(function (err, page) {
          if (err) return next(err);

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
      
      Book.findById(page.bookID, function (err, book) {
        if (err) return next(err);

        // Remove page reference in book
        var i = book.pages.indexOf(req.query.pageID);
        if (i > -1) book.pages.splice(i, 1);

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

      Book.findById(page.bookID, function (err, book) {
        if (err) return next(err);

        // Return error if user is not author the page's book.
        if (!book.owner.equals(req.user.id) && book.authors.indexOf(req.user.id) === -1) {
          return next("Error updating page: User not author.");
        }

        // Update the page's components.
        page.components = req.body.components;

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
