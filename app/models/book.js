var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	title: { type: String, unique: true },
	authors: [],
	content: String
});

module.exports = mongoose.model('Book', bookSchema);
