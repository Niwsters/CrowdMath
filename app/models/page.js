var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
  title: String,
  bookID: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  components: [ {} ], // Components are basically the content of the page; text, images, etc.
  path: {}, // The path is the special navigation for dynamic pages.
  defaultPathIndex: { type: Number, min: 0 }
});

module.exports = mongoose.model('Page', pageSchema);