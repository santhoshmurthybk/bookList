const {
    UserInputError
} = require('apollo-server-express');
const Book = require('./dbConnection/book');
const newBook = require('./dbConnection/utils')

const resolvers = {
    Query: {
        books: async (obj, args) => {
            let books;
            if (args.bookId) {
                books = await Book.find({
                    bookId: args.bookId
                })
                if (books.length === 0) {
                    throw new UserInputError('Book not found', {
                        invalidArgs: [`Book Id: ${args.bookId}`]
                    })
                }
                return books;
            }

            books = await Book.find({})
            return books.sort((a, b) => {
                return a.bookId.localeCompare(b.bookId);
            });
        }
    },
    Mutation: {
        addBook: async (obj, args) => {

            const {
                bookId,
                name,
                authorName,
                releaseDate
            } = args.book;

            let book = {};
            book.bookId = bookId;
            book.name = name;
            book.authorName = authorName;
            book.releaseDate = releaseDate;
            let bookModel = newBook(book);

            await bookModel.save()

            return {
                status: true,
                message: 'Book added'
            }
        },
        deleteBook: async (obj, args) => {

            const book = await Book.findOneAndRemove({
                bookId: args.bookId
            });

            if (book) {
                return {
                    status: true,
                    message: 'Book deleted'
                }
            }
            throw new UserInputError('Book not found to delete', {
                invalidArgs: [`Book Id: ${args.bookId}`]
            })
        },
        updateBook: async (obj, args) => {

            const {
                bookId,
                name,
                authorName,
                releaseDate
            } = args.book;

            const book = await Book.findOne({
                bookId: bookId
            })

            if (book) {
                book.name = name;
                book.authorName = authorName;
                book.releaseDate = releaseDate;
                await book.save();
            } else {
                throw new UserInputError('Book not found to update', {
                    invalidArgs: [`Book Id: ${bookId}`]
                })
            }

            return {
                status: true,
                message: 'Book updated'
            }
        }
    }
};

module.exports = resolvers;