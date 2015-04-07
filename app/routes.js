var User = require('../app/models/user');
var Book = require('../app/models/book');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });
  
  app.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });
  
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });
  
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/app', isLoggedIn, function(req, res) {
    res.render('frontend.ejs', {
      user : req.user // get the user out of session and pass to template
    });
  });
  
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/app',
    failureRedirect : '/signup',
    failureFlash : true // allow flash messages
  }));
  
  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/app',
    failureRedirect : '/login',
    failureFlash : true
  }));
  
  // retrieve user
  app.get('/user', function(req, res) {
    if(req.query.username) {
      var user = User.findOne({username: req.query.username}, function(err, user) {
        res.json(user);
      });
		} if(req.query.email) {
			var user = User.findOne({email: req.query.email}, function(err, user) {
				res.json(user);
			})
		} else {
      res.json(req.user);
    }
  });

	app.get('/book', function(req, res) {
		if(req.query.title) {
			Book.findOne({title: req.query.title}, function(err, b) {
				res.json(book);
			});
		}
	});

	app.post('/book', isLoggedIn, function(req, res) {
		if(req.body.author && req.body.title) {
			Book.findOne({title: req.body.title}, function(err, oldBook) {
				if(oldBook) {
					res.send("Error creating book: Book already exists with title: " + req.query.title);
				} else {
					var newBook = new Book();

					newBook.title = req.body.title;
					newBook.authors = [req.body.author];
					newBook.content = '';
					newBook.save(function(err) {
						if(err) {
							res.send("Error saving book: " + err);
						} else {
							res.json(newBook);
						}
					});
				}
			});
		} else {
			res.send("Error creating book: Need both author ID and book title");
		}
	});

	app.put('/book', isLoggedIn, function(req, res) {
		if(req.body.oldBook && req.body.newBook) {
			Book.findOne({title: req.body.oldBook.title}, function(err, book) {
				if(err) {
					res.send("Error updating book: " + err);
				} else {
					if(book.authors.indexOf(req.user.username) > -1) {
						for(var attr in req.body.newBook) {
							if(book.hasOwnProperty(attr)) {
								book[attr] = newBook[attr];
							}
						}

						res.send("Success updating book");
					} else {
						res.send("Error updating book: User " + req.user.username + " is not author of book");
					}
				}
			});	
		} else {
			res.send("Error updating book: Need both book to update and updated book attributes");
		}
	})
}

var isLoggedIn = function(req, res, next) {
  
  // if user is authenticated in the session, carry on
  if(req.isAuthenticated())
    return next();
  
  // if not redirect them to the home page
  res.redirect('/');
};
