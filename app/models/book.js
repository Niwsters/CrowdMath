var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
	title: { type: String, unique: true },
	authors: [],
	pages: []
});

module.exports = mongoose.model('Book', bookSchema);
