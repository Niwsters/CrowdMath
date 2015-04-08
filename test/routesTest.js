var should = require('should');
var assert = require('assert');
var app = require('../server.js');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('../config/database');
var bcrypt = require('bcrypt-nodejs');
var User = require('../app/models/user.js');
var Book = require('../app/models/book.js');
var factory = require('./factory');

describe('Routing', function() {
	var url = "localhost:8080",
			password = 'lolpan',
			agent,
			loginAgent,
			initAgent,
			stringContains,
			emptyDatabase;
	
	emptyDatabase = function(done) {
		User.remove({email: {$ne: "agent@test.com"}}, function(err) {
			should.not.exist(err);
			Book.remove({}, function(err) {
				should.not.exist(err);
				done();
			});
		});
	};

	loginAgent = function(done) {
		agent
		.post('/login')
		.send({email: agent.user.email, password: password})
		.end(function(err, res) {
			should.not.exist(err);
			should.exist(res.headers['set-cookie']);
			done();
		})
	}

	initAgent = function(done) {
		agent = request.agent(app);

		User.findOne({email: "agent@test.com"}, function(err, user) {

			if(!user) {
				user = new User();
				user.username = "Agent";
				user.email = "agent@test.com";
				user.password = user.generateHash(password);
				user.save(function(err) {
					should.not.exist(err);

					agent.user = user;
					loginAgent(done);
				});
			} else {
				agent.user = user;
				loginAgent(done);
			}
		});
	};

	before(function(done) {
		emptyDatabase(done);
	});

	afterEach(function(done) {
		emptyDatabase(done);
	});

	describe('/login', function() {
		
		describe('POST', function() {

			it('should redirect to /app if authentication succeeds', function(done) {
				var user = factory.User({password: password});

				user.save(function(err) {
					should.not.exist(err);

					request(app)
					.post('/login')
					.send({email: user.email, password: password})
					.end(function(err, res) {
						should.not.exist(err);
						res.header.location.should.equal('/app');
						done();
					})
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
				});
			});

		});
	});

	describe('restricted', function() {
		var restrictedRoutes = {
			get: [
				
			],
			post: [
				'/book'
			],
			put: [
				'/book'
			],
			delete: [
				'/book'
			]
		},
		method, routes, route,
		redirectTest = function(route, method) {
			it(route + ' ' + method + ' should redirect to / if not logged in', function(done) {
				request(app)
				[method](route)
				.end(function(err, res) {
					should.not.exist(err);
					res.header.location.should.equal('/');
					done();
				});
			});
		};

		for(method in restrictedRoutes) {
			routes = restrictedRoutes[method];
			for(route in routes) {
				redirectTest(routes[route], method);
			}
		}
		
	});

	describe('public', function() {
		describe('/user', function() {
			describe('GET', function() {
				var user;

				before(function(done) {
					user = factory.User();
					user.save(function(err) {
						should.not.exist(err);
						done();
					})
				})

				it('should return user with given ID', function(done) {
					request(app)
					.get('/user')
					.query({id: user.id})
					.end(function(err, res) {
						res.body.email.should.equal(user.email);
						done();
					});
				});
			});
		});

		describe('/book', function() {
			describe('GET', function() {
				var book;

				before(function(done) {
					var user = factory.User();
					user.save(function(err) {
						should.not.exist(err);
						book = factory.Book(user.id);
						book.save(function(err) {
							should.not.exist(err);
							done();
						});
					});
				});

				it('should return the book with given ID', function(done) {
					request(app)
					.get('/book')
					.query({id: book.id})
					.end(function(err, res) {
						res.body.title.should.equal(book.title);
						done();
					});
				});

			});
		});
	});

	describe('logged in', function() {

		before(function(done) {
			initAgent(done);
		});
		
		describe('/user', function() {
			describe('GET', function() {

				it('should return the logged in user if no query is given', function(done) {
					agent
					.get('/user')
					.end(function(err, res) {
						should.not.exist(err);
						res.body.email.should.equal(agent.user.email);
						done();
					});
				});

			});
		});

		describe('/book', function() {
			var user;

			before(function(done) {
				user = factory.User();
				user.save(function(err) {
					should.not.exist(err);
					done();
				});
			});

			describe('POST', function() {

				it('should create a new book with given authorID and title', function(done) {
					var authorID = user.id,
							title = "Bookie";

					agent
					.post('/book')
					.send({authorID: authorID, title: title})
					.end(function(err, res) {
						should.not.exist(err);
						res.body.authors[0].should.equal(authorID);
						done();
					});
				});
			});

			describe('PUT', function() {
				var book, user2;

				beforeEach(function(done) {
					book = factory.Book(agent.user.id);
					book.save(function(err) {
						should.not.exist(err);

						user2 = factory.User({username: "Tester 2", email: "tester2@test.com"});
						user2.save(function(err) {
							should.not.exist(err);
							done()
						})
					});
				});

				it('should update book when given ID and new book attributes', function(done) {
					var newTitle = "New title",
							newContent = "New content",
							newAuthors = [book.authors[0], user2.id];

					agent
					.put('/book')
					.send({id: book.id, newAttrs: {title: newTitle, content: newContent, authors: newAuthors}})
					.end(function(err, res) {
						should.not.exist(err);

						res.body.title.should.equal(newTitle);
						res.body.content.should.equal(newContent);
						res.body.authors.length.should.equal(2);

						done();
					});
				});

				it('should not update book if logged in user is not author of the book', function(done) {
					book.authors = [user2.id];
					book.save(function(err) {
						var newTitle = "A different title";

						should.not.exist(err);

						agent
						.put('/book')
						.send({id: book.id, newAttrs: {title: newTitle}})
						.end(function(err, res) {
							should.not.exist(err);

							Book.findById(book.id, function(err, b) {
								should.not.exist(err);

								b.title.should.not.equal(newTitle);
							});

							res.text.should.equal("Error updating book: User not author");

							done();
						});
					});
				});

			});

			describe('DELETE', function() {
				var book;

				beforeEach(function(done) {
					book = factory.Book(agent.user.id);
					book.save(function(err) {
						should.not.exist(err);
						done();
					});
				});

				it('should delete book with given ID', function(done) {
					agent
					.delete('/book')
					.send({id: book.id})
					.end(function(err, res) {
						res.text.should.equal("Successfully removed book");

						Book.findById(book.id, function(err, b) {
							should.not.exist(b);
							done();
						});
					});
				});

			});
		});
	});
});
