var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  title: {
    type: String,
    unique: true
  },
  dynamic: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authors: [ { type: mongoose.Schema.Types.ObjectId, ref: 'User' } ],
  pages: [
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' },
      title: String
    }
  ]
});

// Create a local isUserAuthor variable that is not saved in the database
bookSchema.virtual('isUserAuthor')
  .get(function () {
    return this._isUserAuthor;
  })
  .set(function (isUserAuthor) {
    return this._isUserAuthor = isUserAuthor;
  });

bookSchema.set('toObject', {
  getters: true
});

bookSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Book', bookSchema);
