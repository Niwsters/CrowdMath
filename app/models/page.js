var mongoose = require('mongoose');

var pageSchema = mongoose.Schema({
  bookID: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true
  },
  components: [ {} ],
  paths: [ mongoose.Schema.Types.ObjectId ],
  defaultPathIndex: { type: Number, min: 0 }
});

module.exports = mongoose.model('Page', pageSchema);