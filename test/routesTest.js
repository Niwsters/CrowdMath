var should = require('should');
var assert = require('assert');
var app = require('../server.js');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var User = require('../app/models/user.js');
var Book = require('../app/models/book.js');

describe('Routing', function() {
	var url = "localhost:8080",
			generatePwd = function(password) {return bcrypt.hashSync(password, bcrypt.genSaltSync(8))},
			user = {username: 'Tester', email: 'tester@test.com', password: 'lolpan'},
			testBook = {title: 'Test book'},
			agent,
			initUser,
			initAgent,
			initBook,
			stringContains;
	
	initUser = function(done) {
		var newUser = new User();

		newUser.email = user.email;
		newUser.username = user.username;
		newUser.password = newUser.generateHash(user.password);
		newUser.save(function(err) {
			should.not.exist(err);
		});
	}

	initAgent = function(done) {
		agent = request.agent(app);
					
		agent
		.post('/login')
		.send({email: user.email, password: user.password})
		.end(function(err, res) {
			should.not.exist(err);
			should.exist(res.headers['set-cookie']);
			done();
		});
	}

	initBook = function(done) {
		book = {};
		book.authors = [user.username];
		book.title = 'Test book';
		book.content = '';
		Book.update({title: testBook.title}, book, {upsert: true}, function(err) {
			should.not.exist(err);
			done();
		})
	}

	stringContains = function(string1, string2) {
		return string1.indexOf(string2) > -1;
	}
	
	before(function(done) {
		User.remove({}, function(err) {
			should.not.exist(err);
			Book.remove({}, function(err) {
				should.not.exist(err);
				initUser(initBook(done));
			})
		})
	});

	describe('/login', function() {
		
		describe('POST', function() {
			it('should redirect to /app if authentication succeeds', function(done) {
				request(app)
				.post('/login')
				.send({email: user.email, password: user.password})
				.end(function(err, res) {
					should.not.exist(err);
					res.header.location.should.equal('/app');
					done();
				});
			});

			it('should redirect to /login if authentication fails', function(done) {
				request(app)
				.post('/login')
				.send({email: 'tester@test.com', password: 'wrongpassword'})
				.end(function(err, res) {
					should.not.exist(err);
					res.header.location.should.equal('/login');
					done();
				})
			})
		})
	});

	describe('/user', function() {

		describe('GET', function() {
			it('should return user with given email', function(done) {
				request(app)
				.get('/user')
				.query({email: user.email})
				.end(function(err, res) {
					should.not.exist(err);
					res.body.email.should.equal(user.email);
					done();
				});
			});

			describe('logged in', function() {

				before(function(done) {
					initAgent(done);
				});

				it('should return the logged in user if no query username is given', function(done) {
					agent
					.get('/user')
					.end(function(err, res) {
						should.not.exist(err);
						res.body.email.should.equal(user.email);
						done();
					});
				});
			});
		});
	});

	describe('/book', function() {
		before(function(done) {
			done();
		})
		describe('GET', function() {
			it('should return the book with given title', function(done) {
				request(app)
				.get('/book')
				.query({title: testBook.title})
				.end(function(err, res) {
					should.not.exist(err);
					res.body.title.should.equal(testBook.title);
					done();
				})
			})
		});

		describe('POST', function() {
			
			it('should redirect to / if not logged in', function(done) {
				request(app)
				.post('/book')
				.end(function(err, res) {
					res.header.location.should.equal('/');
					done();
				})
			})

			describe('logged in', function() {
				before(function(done) {
					initAgent(done);
				});

				it('should create new book with given author and title', function(done) {
					var bookTitle = 'A book';
					Book.findOne({title: bookTitle}, function(err, b) {
						should.not.exist(err);
						if(b) {
							b.remove();
						}
					});

					agent
					.post('/book')
					.send({author: user.username, title: bookTitle})
					.end(function(err, res) {
						should.not.exist(err);
						res.body.title.should.equal(bookTitle);
						res.body.authors[0].should.equal(user.username);
						done();
					});
				});

				it('should return error message when author or title is not given', function(done) {
					agent
					.post('/book')
					.end(function(err, res) {
						// Asserts true if res.text contains "Error"
						stringContains(res.text, "Error").should.be.ok;
						done();
					});
				});
			});

			describe('PUT', function() {
				describe('logged in', function() {
					before(function(done) {
						initAgent(done);
					});

					it('should update book when given old book and new book', function(done) {
						var oldBook = {title: testBook.title},
								newBook = {title: 'New title', content: 'Blargh'};
						
						agent
						.put('/book')
						.send({oldBook: oldBook, newBook: newBook})
						.end(function(err, res) {
							should.not.exist(err);
							stringContains(res.text, "Success").should.be.ok
							done();
						});
					});

					it('should not update book if the logged in user is not author of the book', function(done) {
						var b = new Book(),
								newTitle = "Book with this author";
						b.title = "Book with other author";
						b.content = '';
						b.authors = ['otherauthor'];
						b.save(function(err) {
							should.not.exist(err);
						});

						agent
						.put('/book')
						.send({oldBook: {title: b.title}, newBook: {title: newTitle}})
						.end(function(err, res) {
							should.not.exist(err);
							Book.findOne({title: newTitle}, function(err, book) {
								should.not.exist(book);
								done();
							});
						});
					});
				});
			});
		});
	});
});
