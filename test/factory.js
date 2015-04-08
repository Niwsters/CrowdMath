Book = require('../app/models/book.js');
User = require('../app/models/user.js');

var factory = {
	User: function(attrs) {
		var user = new User();
		
		attrs = attrs || {};

		user.email = attrs.email || "tester@test.com";
		user.username = attrs.username || "Tester";
		user.password = user.generateHash(attrs.password || "lolpan");

		return user;
	},
	Book: function(authorID, attrs) {
		var book;

		attrs = attrs || {};

		if(!authorID) {
			throw "Book factory needs an author ID";
		}
		
		book = new Book();

		book.title = attrs.title || "Book with no name";
		book.content = attrs.content || '';
		book.authors = [authorID];

		return book;
	}
};




module.exports = factory;
