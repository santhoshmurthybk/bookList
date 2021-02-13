const Book = require('./book');

const newBook = (book) => {
    return new Book(book);
}

module.exports = newBook;