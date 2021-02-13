const fs = require('fs');
const EasyGraphQLTester = require('easygraphql-tester');
const resolvers = require('./resolvers');
const Book = require('./dbConnection/book');
const newBook = require('./dbConnection/utils')

jest.mock('./dbConnection/book')
jest.mock('./dbConnection/utils')

describe('test the schema', () => {
    let tester;

    beforeAll(() => {
        const schema = fs.readFileSync('./schema/schema.graphql', {
            encoding: 'utf-8'
        });

        tester = new EasyGraphQLTester(schema, resolvers);
    })

    test('books query', () => {

        const BOOKS_QUERY = `
            query books {
                books{
                    name
                    bookId
                    authorName
                    releaseDate
                }
            }
        `

        const mockArray = [
            {
              name: 'blah',
              bookId: '12345',
              authorName: 'blah blah',
              releaseDate: 123
            },
            {
              name: 'blah',
              bookId: '1236',
              authorName: 'blah blah',
              releaseDate: 1234
            }
          ]

        const expectedResult = {
            books: [
                {
                  name: 'blah',
                  bookId: '12345',
                  authorName: 'blah blah',
                  releaseDate: 123
                },
                {
                  name: 'blah',
                  bookId: '1236',
                  authorName: 'blah blah',
                  releaseDate: 1234
                }
              ]
        }

        Book.find.mockReturnValue(mockArray);

        tester
            .graphql(BOOKS_QUERY)
            .then(result => {
                expect(result.data).toEqual(expectedResult);
            })
            .catch(err => console.log(err));
    });

    test('books query with a bookID', () => {

        const BOOKS_QUERY = `
            query books {
                books(bookId:"123"){
                    name
                    bookId
                    authorName
                    releaseDate
                }
            }
        `

        const mockArray = [
            {
              name: 'blah',
              bookId: '123',
              authorName: 'blah blah',
              releaseDate: 123
            }
          ]

        const expectedResult = {
            books: [
                {
                  name: 'blah',
                  bookId: '123',
                  authorName: 'blah blah',
                  releaseDate: 123
                }
              ]
        }

        Book.find.mockReturnValue(mockArray);

        tester
            .graphql(BOOKS_QUERY)
            .then(result => {
                expect(result.data).toEqual(expectedResult);
            })
            .catch(err => console.log(err));
    });

    test('books query with a bookID and bookId not found', async () => {

        const BOOKS_QUERY = `
            query books {
                books(bookId:"123"){
                    name
                    bookId
                    authorName
                    releaseDate
                }
            }
        `

        const mockArray = []

        Book.find.mockReturnValue(mockArray);

        try {
            await tester.graphql(BOOKS_QUERY)
          } catch (err) {
            expect(err.message).not.toBeNull();
          }
    });

    test('add book mutation', () => {

        const ADD_BOOK_MUTATION = `
        mutation book{
            addBook(book:{
              bookId:"1234",
              releaseDate: 123,
              authorName: "blah blah",
              name: "blah"
            }){
              status
              message
            }
          }
        `
        const expectedResult = {
            addBook: {
                status: true,
                message: "Book added"
              }
        }

        const book = new Book();

        newBook.mockReturnValue(book);
        
        book.save.mockReturnValue('')

        tester
            .graphql(ADD_BOOK_MUTATION)
            .then(result => {
                expect(result.data).toEqual(expectedResult);
            })
            .catch(err => console.log(err));
    });

    test('update book mutation', () => {

        const UPDATE_BOOK_MUTATION = `
        mutation book{
            updateBook(book:{
              bookId:"1234",
              releaseDate: 123,
              authorName: "blah blah",
              name: "blah"
            }){
              status
              message
            }
          }
        `
        const expectedResult = {
            updateBook: {
                status: true,
                message: "Book updated"
              }
        }
        
        const book = new Book({
            name: 'blah',
            bookId: '1236',
            authorName: 'blah blah',
            releaseDate: 1234
        })

        Book.findOne.mockReturnValue(book)

        book.save.mockReturnValue('')

        tester
            .graphql(UPDATE_BOOK_MUTATION)
            .then(result => {
                expect(result.data).toEqual(expectedResult);
            })
            .catch(err => console.log(err));
    });

    test('update book mutation when book not found', async () => {

        const UPDATE_BOOK_MUTATION = `
        mutation book{
            updateBook(book:{
              bookId:"1234",
              releaseDate: 123,
              authorName: "blah blah",
              name: "blah"
            }){
              status
              message
            }
          }
        `
        
        Book.findOne.mockReturnValue(undefined)

        try {
            await tester.graphql(UPDATE_BOOK_MUTATION)
          } catch (err) {
            expect(err.message).not.toBeNull();
          }
    });

    test('delete book mutation', () => {

        const DELETE_BOOK_MUTATION = `
        mutation book{
            deleteBook(bookId:"1234"){
              status
              message
            }
          }
        `
        const expectedResult = {
            deleteBook: {
                status: true,
                message: "Book deleted"
              }
        }
        
        Book.findOneAndRemove.mockReturnValue({})

        tester
            .graphql(DELETE_BOOK_MUTATION)
            .then(result => {
                expect(result.data).toEqual(expectedResult);
            })
            .catch(err => console.log(err));
    });

    test('delete book mutation when book not found', async () => {

        const DELETE_BOOK_MUTATION = `
        mutation book{
            deleteBook(bookId:"1234"){
              status
              message
            }
          }
        `
        
        Book.findOneAndRemove.mockReturnValue(undefined)

        try {
            await tester.graphql(DELETE_BOOK_MUTATION)
          } catch (err) {
            expect(err.message).not.toBeNull();
          }
    });


});