var User = require('../app/models/user');

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
  app.get('/user', isLoggedIn, function(req, res) {
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
  
  // retrieve user's book
  app.get('/user/book', isLoggedIn, function(req, res) {
    
    User.findOne({username: req.query.username}, function(err, user) {
      var book = user.books.filter(function(book) {
        return book.title === req.query.bookTitle;
      }).pop();
      
      res.json(book);
    })
    
  });
  
  app.post('/user/book', isLoggedIn, function(req, res) {
    
    var newBook = {
      title: req.body.title
    }
    
    req.user.books.push(newBook);
    req.user.save(function(err) {
      if(err) {
        res.send(err);
      } else {
        res.json(newBook);
      }
    });
  });
	app.delete('/user/book', isLoggedIn, function(req, res) {
		indexToRemove = req.user.books.indexOf(req.query.book);
		if(indexToRemove > -1) {
			req.user.books.splice(indexToRemove, 1);
			req.user.save(function(err) {
				if(err) {
					res.send(err);
				} else {
					res.send("Book successfully deleted!");
				}
			});
		} else {
			res.send("Book not found");
		}
	});
}

var isLoggedIn = function(req, res, next) {
  
  // if user is authenticated in the session, carry on
  if(req.isAuthenticated())
    return next();
  
  // if not redirect them to the home page
  res.redirect('/');
};
