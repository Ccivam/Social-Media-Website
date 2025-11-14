const mongoose=require('mongoose');
const env=require('./environment');

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

// Use environment variable for production, localhost for development
const mongoURL = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contacts_lists_db";

console.log('Connecting to database...');
console.log('Using:', mongoURL.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});

const db=mongoose.connection;

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

db.once('open', function(){
    console.log('✓ Successfully connected to the database');
    console.log('✓ Database:', mongoURL.includes('mongodb.net') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB');
});

module.exports = db;
