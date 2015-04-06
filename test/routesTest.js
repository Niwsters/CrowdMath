var should = require('should');
var assert = require('assert');
var app = require('../server.js');
var request = require('supertest');
var mongoose = require('mongoose');
var db = require('../config/database');
var User = require('../app/models/user.js');

describe('Routing', function() {
	var url = "localhost:8080",
			user = {username: 'Tester', email: 'tester@test.com', password: 'lolpan'},
			testBook = {title: 'Test book'},
			agent;

	var initAgent = function(done) {
		agent = request.agent(app);
					
		agent
		.post('/login')
		.send(user)
		.end(function(err, res) {
			should.not.exist(err);
			should.exist(res.headers['set-cookie']);
			done();
		});
	}
	
	before(function(done) {
		var newUser = new User();

		newUser.username = user.username;
		newUser.email = user.email;
		newUser.password = newUser.generateHash(user.password);
		
		User.findOne({email: user.email}, function(err, oldUser) {
			if(oldUser) {
				oldUser.remove(function(err) {
					newUser.save(function(err) {
						should.not.exist(err);
						done();
					});
				});
			} else {
				newUser.save(function(err) {
					should.not.exist(err);
					done();
				});
			}
		});
	});

	describe('/login', function() {
		
		describe('POST', function() {
			it('should redirect to /app if authentication succeeds', function(done) {
				request(app)
				.post('/login')
				.send(user)
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
			it('should redirect to / if not logged in', function(done) {
				request(app)
				.get('/user')
				.end(function(err, res) {
					if(err) {
						throw err;
					} else {
						res.header.location.should.equal('/');
						done();
					}
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
					
				it('should return the requested user if email given', function(done) {
					agent
					.get('/user')
					.query({email: 'sebastian.vasser@gmail.com'})
					.end(function(err, res) {
						should.not.exist(err);
						res.body.email.should.equal('sebastian.vasser@gmail.com');
						done();
					});
				});

			});
		});
	});

	describe('/user/book', function() {
		describe('GET', function() {
			describe('logged in', function() {
				before(function(done) {
					/* Initialize agent */
					initAgent(function() {
						/* Then create the test book */
						User.findOneAndUpdate(
							{email: user.email},
							{books: [testBook]},	
							function(err, user) {
								done();
							}
						);
					});
				});

				it('should return book if username and book title given', function(done) {
					agent
					.get('/user/book')
					.query({username: user.username, bookTitle: testBook.title})
					.end(function(err, res) {
						should.not.exist(err);
						res.body.title.should.equal(testBook.title);
						done();
					});
				});
			});
		});

		describe('POST', function() {
			describe('logged in', function() {
				before(function(done) {
					initAgent(done);
				});

				it('should create new book with given title', function(done) {
					agent
					.post('/user/book')
					.send({title: 'A book'})
					.end(function(err, res) {
						should.not.exist(err);
						res.body.title.should.equal('A book');
						done();
					});
				});
			});
		});
	});
});
