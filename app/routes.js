var User = require('../app/models/user'),
    Book = require('../app/models/book'),
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
      if(!book) return next("Error retrieving book: Book not found.");
      
      // Set isUserAuthor to true if logged in user is author of the book
      book.isUserAuthor = false;
      if (req.user && book.authors.indexOf(req.user.id) > -1) {
        book.isUserAuthor = true;
      }
      
      res.json(book);
    })
  });

  app.post('/book', isLoggedIn, function (req, res, next) {
    var book = new Book();
    
    if (!req.body.title) throw "Error creating book: No title given.";
    
    book.title = req.body.title;
    book.authors = [req.user.id];
    book.pages = [];
    
    // Check if book with given title already exists (for error checking reasons).
    Book.findOne({title: book.title}, function(err, b) {
      if (err) return next(err);
      
      // Return error if title already taken.
      if (b) return next("Error creating book: Title already taken.");
      
      book.save(function (err) {
        if(err) return next(err);
        
        res.json(book);
      });
    });
  });

  app.put('/book', isLoggedIn, function (req, res, next) {
    var id = req.body.id,
        newAttrs = req.body.newAttrs;
    
    if(!id) next("Error updating book: ID not given.");
    if(!newAttrs) next("Error updating book: Attributes not given.");
    
    Book.findById(id, function (err, book) {
      var attr;
      
      if (err) 
        return next(err);
      
      if(!book) 
        return next("Error updating book: Book not found with given ID");
      
      if(book.authors.indexOf(req.user.id) === -1) 
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
      
      if(book.authors.indexOf(req.user.id) === -1)
        return next("Error deleting book: User not author.");
      
      book.remove(function(err) {
        if(err) return next(err);
        res.send("Successfully deleted book.");
      });
      
    });
  });
  
  app.get('/books', function (req, res) {
    var q = {};
    
    if (req.query.authorID) q.authors = req.query.authorID;
    
    Book.find(q, function (err, books) {
      if (err) throw err;
      res.json(books);
    });
  });
  
  app.get('/book/page', function (req, res, next) {
    if(req.query.bookTitle) {
      if(req.query.pageNumber) {
        Book.findOne({title: req.query.bookTitle}, function (err, book) {
          if(err) return next(err);
          
          if(!book) return next("Error retrieving page: Book not found.");
          
          var response = {};

          response.page = book.pages[req.query.pageNumber - 1];
          response.pageCount = book.pages.length;

          res.json(response);
        });
      } else {
        res.send("Error retrieving page: Page number not given.");
      }
    } else {
      res.send("Error retrieving page: Book title not given.");
    }
  });
  
  app.post('/book/page', isLoggedIn, function(req, res) {
    
    if(req.body.bookTitle) {
      Book.findOne({title: req.body.bookTitle}, function (err, book) {

        if(book.authors.indexOf(req.user.id) > -1) {
          book.pages.push([]);
          book.save(function(err, book) {
            if(!err) {
              res.json(book);
            } else {
              res.send("Error creating page: " + err);
            }
          });
        } else {
          res.send("Error creating page: User not author of book");
        }

      });
    } else {
      res.send("Error creating page: Book title not given.");
    }
    
  });
  
  app.delete('/book/page', isLoggedIn, function(req, res) {
    if(req.query.bookTitle) {
      if(req.query.pageNumber) {
        Book.findOne({title: req.query.bookTitle}, function (err, book) {

          if(book.authors.indexOf(req.user.id) > -1) {
            book.pages.splice(req.query.pageNumber - 1, 1);
            book.save(function(err, book) {
              res.json(book);
            });
          } else {
            res.send("Error deleting page: User not author of book.");
          }

        });
      } else {
        res.send("Error deleting page: Page number not given.");
      }
      
    } else {
      res.send("Error deleting page: Book title not given.");
    }
  })
  
  app.put('/book/page', isLoggedIn, function(req, res) {
    if(req.body.bookTitle) {
      if(req.body.pageNumber) {
        if(req.body.content instanceof Array) {
          
          Book.findOne({title: req.body.bookTitle}, function (err, book) {
            if(book.authors.indexOf(req.user.id) > -1) {
              book.pages.splice(req.body.pageNumber - 1, 1, req.body.content);
              book.save(function (err, book) {
                res.json(book);
              });
            } else {
              res.send("Error updating page: User not author of book.");
            }
          });
          
        } else {
          res.send("Error updating page: Given content is not an array.");
        }
      } else {
        res.send("Error updating page: Page number not given.");
      }
    } else {
      res.send("Error updating page: Book title not given.");
    }
  });
}

var isLoggedIn = function (req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if not redirect them to the home page
  res.redirect('/');
};