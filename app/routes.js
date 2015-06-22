var User = require('../app/models/user'),
    Book = require('../app/models/book'),
    isContentCorrectForm;

isContentCorrectForm = function(components) {
  for(var i=0; i<components.length; i++) {
    if(typeof components[i].type !== 'string' ||
       typeof components[i].content !== 'string' ||
       Object.keys(components[i]).length !== 2) {
      return false;
    }
  }
  
  return true;
}



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
    
    /* res.render('signup.ejs', {
      message: req.flash('signupMessage')
    }); */
  });
  
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/app', isLoggedIn, function (req, res) {
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
    successRedirect: '/app',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // retrieve user
  app.get('/user', function (req, res) {
    if (req.query.username) {
      User.findOne({
        username: req.query.username
      }, function (err, user) {
        if (err) res.text(err);
        res.json(user);
      });
    } else if (req.query.email) {
      User.findOne({
        email: req.query.email
      }, function (err, user) {
        if (err) throw err;
        res.json(user);
      });
    } else if (req.query.id) {
      User.findById(req.query.id, function (err, user) {
        if (err) throw err;
        res.json(user);
      });
    } else {
      res.json(req.user);
    }
  });

  app.get('/book', function (req, res) {
    if (req.query.id) {
      Book.findById(req.query.id, function (err, book) {
        if (err) throw err;
        res.json(book);
      });
    } else if (req.query.authorID) {
      Book.find({
        authors: req.query.authorID
      }, function (err, books) {
        if (err) throw err;
        res.json(books);
      });
    } else if (req.query.title) {
      Book.findOne({
        title: req.query.title
      }, function (err, book) {
        if (err) throw err;
        res.json(book);
      })
    } else {
      Book.find({}, function (err, books) {
        if (err) throw err;
        res.json(books);
      })
    }
  });

  app.post('/book', isLoggedIn, function (req, res) {
    if (req.body.title) {
      Book.findOne({
        title: req.body.title
      }, function (err, book) {
        if (book) {
          res.status(500).send("Error creating book: Title already taken");
        } else {
          book = new Book();

          book.title = req.body.title;
          book.authors = [req.user.id];
          
          // Add default page for testing
          book.pages = [
            [
              {
                type: 'text',
                content: 'Blargh'
              },
              {
                type: 'math',
                content: 'x^2'
              }
            ]
          ];

          book.save(function (err) {
            if (err) throw err;

            res.json(book);
          });
        }
      });
    } else {
      throw "Error creating book: No title given";
    }
  });

  app.put('/book', isLoggedIn, function (req, res) {
    var id = req.body.id,
        newAttrs = req.body.newAttrs;
    
    if (id) {
      if (newAttrs) {
        Book.findById(id, function (err, book) {
          if (book.authors.indexOf(req.user.id) > -1) {
            var attr;

            if (err) throw err;

            for (attr in newAttrs) {
              if (newAttrs.hasOwnProperty(attr)) {
                book[attr] = newAttrs[attr];
              }
            }

            book.save(function (err, book) {
              if (err) throw err;

              res.json(book);
            });
          } else {
            res.send("Error updating book: User not author");
          }
        });
      } else {
        throw "Error updating book: newAttrs not given";
      }
    } else {
      throw "Error updating book: ID not given";
    }
  });

  app.delete('/book', isLoggedIn, function (req, res) {
    if (req.query.id) {
      Book.remove({
        _id: req.query.id
      }, function (err) {
        if (err) throw err;
        res.send("Successfully removed book");
      });
    } else {
      throw "Error deleting book: No book ID given";
    }
  });
  
  app.get('/book/page', function (req, res) {
    if(req.query.bookTitle) {
      if(req.query.pageNumber) {
        Book.findOne({title: req.query.bookTitle}, function (err, book) {
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
          
          if(isContentCorrectForm(req.body.content)) {
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
            res.send("Error updating page: Given content is not on the correct form.");
          }
          
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