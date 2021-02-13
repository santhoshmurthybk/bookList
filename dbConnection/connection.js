const mongoose = require('mongoose');

const URI = 'mongodb+srv://<username>:<password>@cluster0.jznsq.mongodb.net/book-list?retryWrites=true&w=majority';

const connectDB = async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('db connected....')
}

module.exports = connectDB;
