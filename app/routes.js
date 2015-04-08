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
      User.findOne({username: req.query.username}, function(err, user) {
				if(err) res.text(err);
        res.json(user);
      });
		} else if(req.query.email) {
			User.findOne({email: req.query.email}, function(err, user) {
				if(err) throw err;
				res.json(user);
			});
		} else if(req.query.id) {
			User.findById(req.query.id, function(err, user) {
				if(err) throw err;
				res.json(user);
			});
		} else {
      res.json(req.user);
    }
  });

	app.get('/book', function(req, res) {
		if(req.query.id) {
			Book.findById(req.query.id, function(err, book) {
				if(err) throw err;
				res.json(book);
			});
		}
	});

	app.post('/book', isLoggedIn, function(req, res) {
		if(req.body.authorID) {
			if(req.body.title) {
				var book = new Book();

				book.title = req.body.title;
				book.authors = [req.body.authorID];
				book.content = '';

				book.save(function(err) {
					if(err) throw err;

					res.json(book);
				});
			}
		}
	});

	app.put('/book', isLoggedIn, function(req, res) {
		if(req.body.id) {
			if(req.body.newAttrs) {
				Book.findById(req.body.id, function(err, book) {
					if(book.authors.indexOf(req.user.id) > -1) {
						var attr;
						
						if(err) throw err;

						for(attr in req.body.newAttrs) {
							if(req.body.newAttrs.hasOwnProperty(attr)) {
								book[attr] = req.body.newAttrs[attr];
							}
						}

						book.save(function(err, book) {
							if(err) throw err;

							res.json(book);
						});
					} else {
						res.send("Error updating book: User not author");
					}
				});
			}
		}
	});

	app.delete('/book', isLoggedIn, function(req, res) {
		Book.remove({_id: req.body.id}, function(err) {
			if(err) throw err;

			res.send("Successfully removed book");
		});
	});
}

var isLoggedIn = function(req, res, next) {
  
  // if user is authenticated in the session, carry on
  if(req.isAuthenticated())
    return next();
  
  // if not redirect them to the home page
  res.redirect('/');
};
