const mongoose = require('mongoose');

const books = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Number,
        required: true
    }
});

module.exports = Book = mongoose.model('book', books);
